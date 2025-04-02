import Portfolio from '../models/portfolioModel';

export const createPortfolio = async (req, res) => {
  try {
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPortfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
    if (!deletedPortfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    
    portfolio.transactionHistory.push(req.body);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};