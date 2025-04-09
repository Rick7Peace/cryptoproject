import apiClient from "../api/apiClient";
import type { ApiResponse } from "../api/apiClient";

export interface CoinMarketData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  circulating_supply: number;
  last_updated: string;
}

export interface CoinDetail extends CoinMarketData {
  description: { en: string };
  market_data: {
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: { github: string[] };
  };
}

export interface MarketParams {
  page?: number;
  perPage?: number;
  currency?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  ids?: string;
}

const marketService = {
    getCoins: async (params: MarketParams = {}): Promise<CoinMarketData[]> => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.perPage) queryParams.append('per_page', params.perPage.toString());
      if (params.currency) queryParams.append('currency', params.currency);
      if (params.sortBy) queryParams.append('sort_by', params.sortBy);
      if (params.sortDirection) queryParams.append('sort_direction', params.sortDirection);
      if (params.ids) queryParams.append('ids', params.ids);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/market/coins?${queryString}` : '/market/coins';
      
      const response = await apiClient.get<ApiResponse<CoinMarketData[]>>(url);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch market data');
      }
      return response.data.data || []; // Return empty array if data is undefined
    },
  
    getCoinPrices: async (
      coinIds: string[], 
      currency: string = 'usd'
    ): Promise<CoinMarketData[]> => {
      const idsParam = coinIds.join(',');
      const response = await apiClient.get<ApiResponse<CoinMarketData[]>>(
        `/market/coins/prices?ids=${idsParam}&currency=${currency}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch coin prices');
      }
      return response.data.data || []; // Return empty array if data is undefined
    },
    
    getCoinDetails: async (coinId: string): Promise<CoinDetail> => {
      const response = await apiClient.get<ApiResponse<CoinDetail>>(`/market/coins/${coinId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch coin details');
      }
      if (!response.data.data) {
        throw new Error(`No details found for coin: ${coinId}`);
      }
      return response.data.data;
    },
    
    searchCoins: async (query: string): Promise<CoinMarketData[]> => {
      const response = await apiClient.get<ApiResponse<CoinMarketData[]>>(`/market/search?q=${encodeURIComponent(query)}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search coins');
      }
      return response.data.data || []; // Return empty array if data is undefined
    }
};
export default marketService;