import express from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All watchlist routes require authentication
router.use(authenticate);

// Get user's watchlist
router.get('/', getWatchlist);

// Add coin to watchlist
router.post('/:coinId', addToWatchlist);

// Remove coin from watchlist
router.delete('/:coinId', removeFromWatchlist);

export default router;