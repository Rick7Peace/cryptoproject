import express from 'express';
import Portfolio from '../models/Portfolio';
import User from '../models/User';

const router = express.Router();

// Get user portfolio
router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('portfolio');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(user.portfolio);
});

// Update user portfolio
router.put('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const updatedPortfolio = await Portfolio.findByIdAndUpdate(user.portfolio, req.body, { new: true });

  res.status(200).json(updatedPortfolio);
});

export default router;
