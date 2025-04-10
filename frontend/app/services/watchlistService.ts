import axios from 'axios';
import type { Crypto } from '../types/cryptoTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get the user's watchlist
export const getUserWatchlist = async (token: string): Promise<Crypto[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/watchlist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch watchlist');
    }
    
    return response.data.data.coins;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

// Add a cryptocurrency to the watchlist
export const addToWatchlist = async (token: string, coinId: string): Promise<Crypto[]> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/watchlist/${coinId}`, 
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add to watchlist');
    }
    
    return response.data.data.coins;
  } catch (error) {
    console.error(`Error adding ${coinId} to watchlist:`, error);
    throw error;
  }
};

// Remove a cryptocurrency from the watchlist
export const removeFromWatchlist = async (token: string, coinId: string): Promise<Crypto[]> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/watchlist/${coinId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove from watchlist');
    }
    
    return response.data.data.coins;
  } catch (error) {
    console.error(`Error removing ${coinId} from watchlist:`, error);
    throw error;
  }
};