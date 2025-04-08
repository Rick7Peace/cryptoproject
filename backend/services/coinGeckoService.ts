import axios from 'axios';
import { ApiError } from '../utils/errorHandler';
import Crypto from '../models/Crypto';

const API_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

// Fetch top cryptocurrencies
export const fetchTopCryptos = async (limit: number = 100) => {
  try {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
        x_cg_demo_api_key: API_KEY
      }
    });

    // Update or create crypto documents
    interface Coin {
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      market_cap: number;
      market_cap_rank: number;
      price_change_percentage_24h: number;
    }

    const coins: Coin[] = response.data as Coin[];
    const promises = coins.map(async (coin: Coin) => {
      return await Crypto.findOneAndUpdate(
        { coinId: coin.id },
        {
          coinId: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          currentPrice: coin.current_price,
          marketCap: coin.market_cap,
          marketCapRank: coin.market_cap_rank,
          priceChangePercentage24h: coin.price_change_percentage_24h,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(promises);
    return response.data;
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw new ApiError('Error fetching cryptocurrency data', 500);
  }
};

// Fetch details for a specific coin
export const fetchCoinDetails = async (coinId: string) => {
  try {
    const response = await axios.get(`${API_URL}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
        x_cg_demo_api_key: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    throw new ApiError('Error fetching coin details', 500);
  }
};

// Fetch price history for a specific coin
export const fetchCoinHistory = async (coinId: string, days: number = 7) => {
  try {
    const response = await axios.get(`${API_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        x_cg_demo_api_key: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    throw new ApiError('Error fetching price history', 500);
  }
};

// Search for coins
export const searchCoins = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        query: query,
        x_cg_demo_api_key: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    throw new ApiError('Error searching for coins', 500);
  }
};