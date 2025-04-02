import express from 'express';
import {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/portfolio', createPortfolio);
router.get('/portfolio/:userId', getPortfolio);
router.put('/portfolio/:userId', updatePortfolio);
router.delete('/portfolio/:userId', deletePortfolio);

export default router;