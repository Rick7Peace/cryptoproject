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
router.get('/', getPortfolio as unknown as express.RequestHandler);

// Get portfolio statistics
router.get('/stats', getPortfolioStats as unknown as express.RequestHandler);

// Add coin to portfolio
router.post('/add/:coinId', addToPortfolio as unknown as express.RequestHandler);

// Update holding (buy more or sell)
router.put('/update/:coinId', updateHolding as unknown as express.RequestHandler);

// Remove coin from portfolio
router.delete('/remove/:coinId', removeFromPortfolio as unknown as express.RequestHandler);

export default router;
