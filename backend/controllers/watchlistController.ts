import { Request, Response } from 'express';
import Watchlist from '../models/Watchlist';
import Crypto from '../models/Crypto';
import { ApiError } from '../utils/errorHandler';

import User from '../models/User';
declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype; // Or just 'any' if you prefer
    }
  }
}

/**
 * Get the current user's watchlist
 */
export const getWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    
    // Find or create user's watchlist
    let watchlist = await Watchlist.findOne({ user: userId }).populate('coins');
    
    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, coins: [] });
      await watchlist.save();
    }
    
    res.status(200).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist',
    });
  }
};

/**
 * Add a cryptocurrency to user's watchlist
 */
export const addToWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { coinId } = req.params;
    
    // Check if coin exists
    const coin = await Crypto.findOne({ coinId });
    if (!coin) {
      throw new ApiError('Cryptocurrency not found', 404);
    }
    
    // Find or create user's watchlist
    let watchlist = await Watchlist.findOne({ user: userId });
    
    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, coins: [coin._id] });
    } else {
      // Check if coin is already in watchlist
      if (watchlist.coins.includes(coin._id as typeof watchlist.coins[number])) {
        res.status(200).json({
          success: true,
          message: 'Coin already in watchlist',
          data: watchlist,
        });
        return;
      }
      
      // Add coin to watchlist
      watchlist.coins.push(coin._id as typeof watchlist.coins[number]);
    }
    
    await watchlist.save();
    
    // Fetch updated watchlist with populated coins
    const updatedWatchlist = await Watchlist.findById(watchlist._id).populate('coins');
    
    res.status(200).json({
      success: true,
      message: 'Coin added to watchlist',
      data: updatedWatchlist,
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
        message: 'Error adding to watchlist',
      });
    }
  }
};

/**
 * Remove a cryptocurrency from user's watchlist
 */
export const removeFromWatchlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { coinId } = req.params;
    
    // Find coin by coinId
    const coin = await Crypto.findOne({ coinId });
    if (!coin) {
      throw new ApiError('Cryptocurrency not found', 404);
    }
    
    // Update watchlist
    const watchlist = await Watchlist.findOneAndUpdate(
      { user: userId },
      { $pull: { coins: coin._id } },
      { new: true }
    ).populate('coins');
    
    if (!watchlist) {
      throw new ApiError('Watchlist not found', 404);
    }
    
    res.status(200).json({
      success: true,
      message: 'Coin removed from watchlist',
      data: watchlist,
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
        message: 'Error removing from watchlist',
      });
    }
  }
};