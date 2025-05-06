import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ApiError } from '../utils/errorHandler';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 * Verifies the token and attaches the user to the request object
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new ApiError('User not found', 401);
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        expired: true
      });
    } else if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Authentication error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
    }
  }
};

/**
 * Middleware to check if the authenticated user is an admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
    });
  }
};

/**
 * Optional middleware - only proceeds if user is authenticated
 * but doesn't block the request if no token is provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    // If no token, just continue without setting user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      // Add user to request if found
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Log the error for server-side diagnostics, but still proceed
    // as this is optional authentication.
    if (error instanceof jwt.JsonWebTokenError) {
      // It's common for optional auth to encounter invalid/expired tokens.
      // You might choose to log these at a lower severity or not at all
      // if they are too noisy, but for now, let's log them.
      console.warn(`Optional auth: Invalid token encountered - ${error.message}`);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.warn(`Optional auth: Expired token encountered - ${error.message}`);
    } else {
      // Log other unexpected errors
      console.error('Optional auth: Unexpected error during token processing:', error);
    }
    // In all error cases for optionalAuth, proceed without an authenticated user.
    next();
  }
};