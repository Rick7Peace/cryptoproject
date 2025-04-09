import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface WatchlistCoin {
  _id: string;
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice?: number;
}

export interface Watchlist {
  _id: string;
  user: string;
  coins: WatchlistCoin[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user's watchlist
 */
export const getWatchlist = async (token: string): Promise<Watchlist> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/watchlist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch watchlist');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

/**
 * Add cryptocurrency to watchlist
 */
export const addToWatchlist = async (token: string, coinId: string): Promise<Watchlist> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/watchlist/${coinId}`, 
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add to watchlist');
    }
    
    return response.data.data;
  } catch (error) {
    console.error(`Error adding ${coinId} to watchlist:`, error);
    throw error;
  }
};

/**
 * Remove cryptocurrency from watchlist
 */
export const removeFromWatchlist = async (token: string, coinId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/watchlist/${coinId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove from watchlist');
    }
  } catch (error) {
    console.error(`Error removing ${coinId} from watchlist:`, error);
    throw error;
  }
};