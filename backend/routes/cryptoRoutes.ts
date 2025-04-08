import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { 
  getTopCryptos,
  getCryptoDetails,
  getCryptoHistory,
  searchCryptos,
  refreshCryptoData,
  getPrices
} from '../controllers/cryptoController';

const router = express.Router();

// Routes defined with proper handler functions
router.get('/top', getTopCryptos);
router.get('/details/:coinId', getCryptoDetails);
router.get('/history/:coinId', getCryptoHistory);
router.get('/search', searchCryptos);
router.get('/prices', getPrices);
router.get('/refresh', authenticate, refreshCryptoData);

export default router;