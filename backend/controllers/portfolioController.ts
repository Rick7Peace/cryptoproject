import { Request, Response } from 'express';
import Portfolio from '../models/Portfolio';
import Crypto from '../models/Crypto';
import { ApiError } from '../utils/errorHandler';
import mongoose from 'mongoose';

/**
 * Get the current user's portfolio
 */
export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    
    // Find or create user's portfolio
    let portfolio = await Portfolio.findOne({ user: userId })
      .populate({
        path: 'holdings.crypto',
        model: 'Crypto'
      });
    
    if (!portfolio) {
      portfolio = new Portfolio({ 
        user: userId, 
        holdings: [],
        totalValue: 0,
        lastUpdated: new Date()
      });
      await portfolio.save();
    }
    
    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio',
    });
  }
};

/**
 * Add cryptocurrency to user's portfolio
 */
export const addToPortfolio = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { coinId } = req.params;
    const { quantity, purchasePrice } = req.body;
    
    // Validate inputs
    if (!quantity || quantity <= 0) {
      throw new ApiError('Quantity must be greater than 0', 400);
    }
    
    if (!purchasePrice || purchasePrice <= 0) {
      throw new ApiError('Purchase price must be greater than 0', 400);
    }
    
    // Check if coin exists
    const coin = await Crypto.findOne({ coinId }) as { _id: string, [key: string]: any };
    if (!coin) {
      throw new ApiError('Cryptocurrency not found', 404);
    }
    
    // Find or create user's portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    
    if (!portfolio) {
      // Create new portfolio with this holding
      portfolio = new Portfolio({
        user: userId,
        holdings: [{
          crypto: new mongoose.Types.ObjectId(coin._id),
          quantity,
          averageBuyPrice: purchasePrice,
          transactions: [] // We would add transaction reference here if we had a Transaction model
        }],
        totalValue: quantity * coin.currentPrice,
        lastUpdated: new Date()
      });
    } else {
      // Check if coin is already in portfolio
      const existingHoldingIndex = portfolio.holdings.findIndex(
        h => h.crypto.toString() === coin._id.toString()
      );
      
      if (existingHoldingIndex !== -1) {
        // Update existing holding
        const existingHolding = portfolio.holdings[existingHoldingIndex];
        const totalQuantity = existingHolding.quantity + quantity;
        const totalValue = (existingHolding.quantity * existingHolding.averageBuyPrice) + 
                           (quantity * purchasePrice);
        
        portfolio.holdings[existingHoldingIndex].quantity = totalQuantity;
        portfolio.holdings[existingHoldingIndex].averageBuyPrice = totalValue / totalQuantity;
      } else {
        // Add new holding
        portfolio.holdings.push({
          crypto: new mongoose.mongo.ObjectId(coin._id.toString()),
          quantity,
          averageBuyPrice: purchasePrice,
          transactions: []
        });
      }
      
      // Update total portfolio value
      portfolio.totalValue = portfolio.holdings.reduce((total, holding) => {
        return total + (holding.quantity * coin.currentPrice);
      }, 0);
      
      portfolio.lastUpdated = new Date();
    }
    
    await portfolio.save();
    
    // Fetch updated portfolio with populated crypto data
    const updatedPortfolio = await Portfolio.findById(portfolio._id)
      .populate({
        path: 'holdings.crypto',
        model: 'Crypto'
      });
    
    res.status(200).json({
      success: true,
      message: 'Cryptocurrency added to portfolio',
      data: updatedPortfolio,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error adding to portfolio',
      });
    }
  }
};

/**
 * Update cryptocurrency holdings in the portfolio
 */
export const updateHolding = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { coinId } = req.params;
    const { quantity, operation } = req.body;
    
    // Validate inputs
    if (!quantity || quantity <= 0) {
      throw new ApiError('Quantity must be greater than 0', 400);
    }
    
    if (!operation || !['buy', 'sell'].includes(operation)) {
      throw new ApiError('Operation must be either "buy" or "sell"', 400);
    }
    
    // Check if coin exists
    const coin = await Crypto.findOne({ coinId }) as { _id: string, [key: string]: any };
    if (!coin) {
      throw new ApiError('Cryptocurrency not found', 404);
    }
    
    // Find portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      throw new ApiError('Portfolio not found', 404);
    }
    
    // Find holding
    const holdingIndex = portfolio.holdings.findIndex(
      h => h.crypto.toString() === coin._id.toString()
    );
    
    if (holdingIndex === -1) {
      throw new ApiError('This cryptocurrency is not in your portfolio', 404);
    }
    
    const holding = portfolio.holdings[holdingIndex];
    
    if (operation === 'sell') {
      // Check if user has enough to sell
      if (holding.quantity < quantity) {
        throw new ApiError('Insufficient holding to sell', 400);
      }
      
      // Update quantity
      holding.quantity -= quantity;
      
      // Remove holding if quantity becomes zero
      if (holding.quantity === 0) {
        portfolio.holdings.splice(holdingIndex, 1);
      }
    } else { // Buy operation
      holding.quantity += quantity;
    }
    
    // Update total portfolio value
    portfolio.totalValue = portfolio.holdings.reduce((total, holding) => {
      return total + (holding.quantity * coin.currentPrice);
    }, 0);
    
    portfolio.lastUpdated = new Date();
    await portfolio.save();
    
    // Fetch updated portfolio with populated crypto data
    const updatedPortfolio = await Portfolio.findById(portfolio._id)
      .populate({
        path: 'holdings.crypto',
        model: 'Crypto'
      });
    
    res.status(200).json({
      success: true,
      message: `Successfully ${operation === 'buy' ? 'bought' : 'sold'} cryptocurrency`,
      data: updatedPortfolio,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating portfolio',
      });
    }
  }
};

/**
 * Remove cryptocurrency completely from portfolio
 */
export const removeFromPortfolio = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { coinId } = req.params;
    
    // Check if coin exists
    const coin = await Crypto.findOne({ coinId });
    if (!coin) {
      throw new ApiError('Cryptocurrency not found', 404);
    }
    
    // Find and update portfolio
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { $pull: { holdings: { crypto: coin._id } } },
      { new: true }
    ).populate({
      path: 'holdings.crypto',
      model: 'Crypto'
    });
    
    if (!portfolio) {
      throw new ApiError('Portfolio not found', 404);
    }
    
    // Update total value
    portfolio.totalValue = portfolio.holdings.reduce((total, holding) => {
      // Need to access currentPrice through populated crypto document
      const cryptoDoc = holding.crypto as any; // Type assertion for populated document
      return total + (holding.quantity * cryptoDoc.currentPrice);
    }, 0);
    
    portfolio.lastUpdated = new Date();
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      message: 'Cryptocurrency removed from portfolio',
      data: portfolio,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error removing from portfolio',
      });
    }
  }
};

/**
 * Get portfolio performance statistics
 */
export const getPortfolioStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    
    // Find portfolio with populated crypto data
    const portfolio = await Portfolio.findOne({ user: userId })
      .populate({
        path: 'holdings.crypto',
        model: 'Crypto'
      });
    
    if (!portfolio) {
      throw new ApiError('Portfolio not found', 404);
    }
    
    // Calculate performance metrics
    const stats = {
      totalValue: 0,
      totalCost: 0,
      profitLoss: 0,
      profitLossPercentage: 0,
      holdings: portfolio.holdings.map(holding => {
        const cryptoDoc = holding.crypto as any; // Type assertion for populated document
        const currentValue = holding.quantity * cryptoDoc.currentPrice;
        const cost = holding.quantity * holding.averageBuyPrice;
        const profitLoss = currentValue - cost;
        const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0;
        
        return {
          name: cryptoDoc.name,
          symbol: cryptoDoc.symbol,
          quantity: holding.quantity,
          averageBuyPrice: holding.averageBuyPrice,
          currentPrice: cryptoDoc.currentPrice,
          currentValue,
          cost,
          profitLoss,
          profitLossPercentage
        };
      })
    };
    
    // Calculate totals
    stats.totalValue = stats.holdings.reduce((total, h) => total + h.currentValue, 0);
    stats.totalCost = stats.holdings.reduce((total, h) => total + h.cost, 0);
    stats.profitLoss = stats.totalValue - stats.totalCost;
    stats.profitLossPercentage = stats.totalCost > 0 ? 
      (stats.profitLoss / stats.totalCost) * 100 : 0;
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error calculating portfolio statistics',
      });
    }
  }
};