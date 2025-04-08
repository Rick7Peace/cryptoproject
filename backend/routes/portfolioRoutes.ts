import express from 'express';
import { 
  getPortfolio, 
  addToPortfolio, 
  updateHolding, 
  removeFromPortfolio,
  getPortfolioStats
} from '../controllers/portfolioController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All portfolio routes require authentication
router.use(authenticate);

// Get user's portfolio
router.get('/', getPortfolio);

// Get portfolio statistics
router.get('/stats', getPortfolioStats);

// Add coin to portfolio
router.post('/add/:coinId', addToPortfolio);

// Update holding (buy more or sell)
router.put('/update/:coinId', updateHolding);

// Remove coin from portfolio
router.delete('/remove/:coinId', removeFromPortfolio);

export default router;
