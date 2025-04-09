import { Request, Response } from 'express';
import User from '../models/User';
import { generateTokens, verifyRefreshToken } from '../utils/jwtUtils';
import { ApiError } from '../utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError('User with this email or username already exists', 400);
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
    });
    
    await user.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id as string);
    
    // Update user with refresh token
    user.refreshToken = refreshToken;
    await user.save();
    
    // Send response without password
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;
    
    res.status(201).json({
      success: true,
      user: userObj,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error registering user',
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id as string);
    
    // Update user with refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    // Send response without password
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;
    
    res.status(200).json({
      success: true,
      user: userObj,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error logging in',
      });
    }
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    
    if (!token) {
      throw new ApiError('Refresh token is required', 400);
    }
    
    // Verify the refresh token
    let decoded;
    try {
decoded = verifyRefreshToken(token);
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      throw new ApiError('Invalid refresh token', 401);
    }
    
    if (!decoded || !decoded.id) {
      throw new ApiError('Invalid refresh token format', 401);
    }
    
    // First find user by ID
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new ApiError('User not found', 401);
    }
    
    // Generate new tokens
    const tokens = generateTokens(user._id as string);
    
    // Update user with new refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();
    
    res.status(200).json({
      success: true,
      ...tokens,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
console.error('Error refreshing token:', error);
      res.status(500).json({
        success: false,
        message: 'Error refreshing token',
      });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear refresh token in database
    const userId = req.user?._id;
    
    if (userId) {
      await User.findByIdAndUpdate(userId, { 
        refreshToken: null 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out',
    });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    // The authenticate middleware already verified the token
    // and attached the user to the request
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    // Return the user without password
    const userObj = req.user.toObject();
    delete (userObj as { password?: string }).password;
    
    res.status(200).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating token'
    });
  }
};