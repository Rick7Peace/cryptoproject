import { Request, Response } from 'express';
import Crypto from '../models/Crypto';
import { ApiError } from '../utils/errorHandler';
import { 
  fetchTopCryptos, 
  fetchCoinDetails, 
  fetchCoinHistory, 
  searchCoins 
} from '../services/coinGeckoService';
import axios from 'axios';

/**
 * Get list of top cryptocurrencies
 */
export const getTopCryptos = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    
    // Get coins from database (cached data)
    let cryptos = await Crypto.find()
      .sort({ marketCapRank: 1 })
      .skip(skip)
      .limit(limit);
    
    // If no data in database or data is stale (>15 minutes), fetch fresh data
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const isDataStale = cryptos.length === 0 || 
      !cryptos[0].lastUpdated || 
      cryptos[0].lastUpdated < fifteenMinutesAgo;
    
    if (isDataStale) {
      // Fetch fresh data from CoinGecko
      await fetchTopCryptos(limit);
      
      // Get updated data from database
      cryptos = await Crypto.find()
        .sort({ marketCapRank: 1 })
        .skip(skip)
        .limit(limit);
    }
    
    // Get total count for pagination
    const total = await Crypto.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        cryptos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
    });
  } catch (error) {
    console.error('Error in getTopCryptos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cryptocurrencies',
    });
  }
};

/**
 * Get details for a specific cryptocurrency
 */
export const getCryptoDetails = async (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    
    // Try to get from database first
    let crypto = await Crypto.findOne({ coinId });
    
    // If not found or data is stale, fetch from API
    if (!crypto) {
      // Fetch detailed data from CoinGecko
      const coinData = await fetchCoinDetails(coinId) as {
        id: string;
        symbol: string;
        name: string;
        image: { large: string };
        market_data: {
          current_price: { usd: number };
          market_cap: { usd: number };
          market_cap_rank: number;
          price_change_percentage_24h: number;
        };
      };
      
      // Save basic data to our database
      crypto = await Crypto.findOneAndUpdate(
        { coinId },
        {
          coinId: coinData.id,
          symbol: coinData.symbol,
          name: coinData.name,
          image: coinData.image.large,
          currentPrice: coinData.market_data.current_price.usd,
          marketCap: coinData.market_data.market_cap.usd,
          marketCapRank: coinData.market_data.market_cap_rank,
          priceChangePercentage24h: coinData.market_data.price_change_percentage_24h,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
      
      // Return the detailed data from API
      res.status(200).json({
        success: true,
        data: coinData,
      });
    } else {
      // If we have it in database but want detailed data
      const coinData = await fetchCoinDetails(coinId);
      
      res.status(200).json({
        success: true,
        data: coinData,
      });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Error in getCryptoDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching cryptocurrency details',
      });
    }
  }
};

/**
 * Get price history for a cryptocurrency
 */
export const getCryptoHistory = async (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    const days = parseInt(req.query.days as string) || 7;
    
    // Check if coin exists in our database
    const crypto = await Crypto.findOne({ coinId });
    if (!crypto) {
      throw new ApiError('Cryptocurrency not found', 404);
    }
    
    // Fetch price history from CoinGecko
    const historyData = await fetchCoinHistory(coinId, days);
    
    res.status(200).json({
      success: true,
      data: historyData,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Error in getCryptoHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching cryptocurrency price history',
      });
    }
  }
};

/**
 * Search for cryptocurrencies
 */
export const searchCryptos = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.length < 2) {
      throw new ApiError('Search query must be at least 2 characters', 400);
    }
    
    // First try to search in our database
    const localResults = await Crypto.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { symbol: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    
    if (localResults.length > 0) {
      res.status(200).json({
        success: true,
        data: localResults,
        source: 'database'
      });
      return;
    }
    
    // If not found locally, search via CoinGecko API
    const searchResults = await searchCoins(query) as { coins: Array<{ id: string; name: string; symbol: string; large?: string; thumb?: string; market_cap_rank?: number }> };
    
    // Map API results to our model format
    const formattedResults = searchResults.coins.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.large || coin.thumb,
      marketCapRank: coin.market_cap_rank || 0
    }));
    
    res.status(200).json({
      success: true,
      data: formattedResults,
      source: 'api'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Error in searchCryptos:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching cryptocurrencies',
      });
    }
  }
};

/**
 * Force refresh cryptocurrency data from API
 */
export const refreshCryptoData = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    
    // Fetch fresh data from CoinGecko
    await fetchTopCryptos(limit);
    
    res.status(200).json({
      success: true,
      message: 'Cryptocurrency data refreshed successfully',
    });
  } catch (error) {
    console.error('Error in refreshCryptoData:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing cryptocurrency data',
    });
  }
};

/**
 * Get current prices for specified cryptocurrencies
 */
export const getPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query;  
    if (!ids) {
      res.status(400).json({
        success: false,
        message: 'Please provide cryptocurrency IDs'
      });
      return;
    }

    // Fetch prices directly from CoinGecko API
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: ids,
          vs_currencies: 'usd',
          include_market_cap: 'true',
          include_24hr_vol: 'true',
          include_24hr_change: 'true',
          x_cg_demo_api_key: process.env.COINGECKO_API_KEY
        }
      }
    );
    
    // Send response but don't return it
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Error fetching cryptocurrency prices:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching cryptocurrency prices' 
      });
    }
  }
};