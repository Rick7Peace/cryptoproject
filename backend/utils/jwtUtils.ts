import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

export const generateTokens = (userId: string) => {
  // Create access token
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
  
  // Create refresh token with longer expiry
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    return decoded;
  } catch (error) {
    throw new ApiError('Invalid refresh token', 401);
  }
};