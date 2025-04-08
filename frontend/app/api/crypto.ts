import axios from 'axios';

// API base URL - adjust based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface Crypto {
  _id: string;
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  priceChangePercentage24h: number;
  lastUpdated: string;
}

export interface CryptoDetail extends Crypto {
  description: { en: string };
  marketData: {
    ath: { usd: number };
    athChangePercentage: { usd: number };
    athDate: { usd: string };
    marketCapRank: number;
    totalVolume: { usd: number };
    high24h: { usd: number };
    low24h: { usd: number };
  };
  links: {
    homepage: string[];
    blockchainSite: string[];
    officialForumUrl: string[];
    chatUrl: string[];
    announcementUrl: string[];
    twitterScreenName: string;
    telegramChannelIdentifier: string;
    subredditUrl: string;
    reposUrl: { github: string[] };
  };
}

export interface HistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface PriceData {
  [key: string]: {
    usd: number;
    usd_market_cap?: number;
    usd_24h_vol?: number;
    usd_24h_change?: number;
  };
}

// API functions
/**
 * Fetch top cryptocurrencies
 */
export const getTopCryptos = async (limit = 100, page = 1): Promise<Crypto[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crypto/top`, {
      params: { limit, page }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch cryptocurrencies');
    }
    
    return response.data.data.cryptos;
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    throw error;
  }
};

/**
 * Fetch details for a specific cryptocurrency
 */
export const getCryptoDetails = async (coinId: string): Promise<CryptoDetail> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crypto/details/${coinId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch crypto details');
    }
    
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    throw error;
  }
};

/**
 * Fetch price history for a specific cryptocurrency
 */
export const getCryptoHistory = async (coinId: string, days = 7): Promise<HistoricalData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crypto/history/${coinId}`, {
      params: { days }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch price history');
    }
    
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    throw error;
  }
};

/**
 * Search for cryptocurrencies
 */
export const searchCryptos = async (query: string): Promise<Crypto[]> => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const response = await axios.get(`${API_BASE_URL}/crypto/search`, {
      params: { q: query }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Search failed');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw error;
  }
};

/**
 * Get current prices for specified cryptocurrencies
 */
export const getCryptoPrices = async (coinIds: string[]): Promise<PriceData> => {
  try {
    if (!coinIds.length) {
      return {};
    }
    
    const response = await axios.get(`${API_BASE_URL}/crypto/prices`, {
      params: { ids: coinIds.join(',') }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch prices');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    throw error;
  }
};

/**
 * Force refresh of cryptocurrency data (admin only)
 * Requires authentication
 */
export const refreshCryptoData = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crypto/refresh`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Error refreshing cryptocurrency data:', error);
    throw error;
  }
};