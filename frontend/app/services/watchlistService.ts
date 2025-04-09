import apiClient from '../api/apiClient';
import type { ApiResponse } from '../api/apiClient';

export interface Coin {
  _id: string;
  id: string;  // Using id instead of coinId to match API response
  name: string;
  symbol: string;
  image: string;
  currentPrice?: number;
  priceChangePercentage24h?: number;
  marketCap?: number;
}

export interface Watchlist {
  _id: string;
  userId: string;
  coins: Coin[];
  createdAt?: string;
  updatedAt?: string;
}

const watchlistService = {
  /**
   * Get the user's watchlist
   */
  getWatchlist: async (): Promise<Watchlist> => {
    const response = await apiClient.get<ApiResponse<Watchlist>>('/watchlist');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch watchlist');
    }
    if (!response.data.data) {
      throw new Error('Watchlist data is missing from response');
    }
    return response.data.data;
  },
  
  /**
   * Add a coin to the watchlist
   */
  addCoin: async (coinId: string): Promise<Watchlist> => {
    const response = await apiClient.post<ApiResponse<Watchlist>>(`/watchlist/${coinId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add to watchlist');
    }
    if (!response.data.data) {
      throw new Error('Watchlist data is missing after adding coin');
    }
    return response.data.data;
  },
  
  /**
   * Remove a coin from the watchlist
   */
  removeCoin: async (coinId: string): Promise<Watchlist> => {
    const response = await apiClient.delete<ApiResponse<Watchlist>>(`/watchlist/${coinId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove from watchlist');
    }
    if (!response.data.data) {
      throw new Error('Watchlist data is missing after removing coin');
    }
    return response.data.data;
  }
};

export default watchlistService;