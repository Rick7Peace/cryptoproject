import express from 'express';
import { register, login, refreshToken, logout, validateToken } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes - apply middleware directly to routes
router.post('/logout', authenticate, logout);
router.get('/validate', authenticate, validateToken);

export default router;