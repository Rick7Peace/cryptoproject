// Authentication API
import axios from 'axios';
import type { AuthResponse } from '../types/authTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';



// Auth API functions
export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const refreshToken = async (token: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken: token
    });
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const logout = async (token: string): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Portfolio types
export interface PortfolioHolding {
  crypto: {
    _id: string;
    coinId: string;
    name: string;
    symbol: string;
    image: string;
    currentPrice: number;
  };
  quantity: number;
  averageBuyPrice: number;
}

export interface Portfolio {
  _id: string;
  user: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  lastUpdated: string;
}

// Portfolio API functions
export const getPortfolio = async (token: string): Promise<Portfolio> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch portfolio');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

export const addToPortfolio = async (token: string, coinId: string, quantity: number, purchasePrice: number): Promise<Portfolio> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/portfolio/add/${coinId}`,
      { quantity, purchasePrice },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add to portfolio');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    throw error;
  }
};

export const updateHolding = async (token: string, coinId: string, quantity: number, operation: 'buy' | 'sell'): Promise<Portfolio> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/portfolio/update/${coinId}`,
      { quantity, operation },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update holding');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
};

// Watchlist types
export interface Watchlist {
  _id: string;
  user: string;
  coins: Array<{
    _id: string;
    coinId: string;
    name: string;
    symbol: string;
    image: string;
    currentPrice: number;
  }>;
}

// Watchlist API functions
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

export const addToWatchlist = async (token: string, coinId: string): Promise<Watchlist> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/watchlist/add/${coinId}`,
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
    
    return response.data.data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (token: string, coinId: string): Promise<Watchlist> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/watchlist/remove/${coinId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove from watchlist');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};