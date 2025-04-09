import apiClient from "../api/apiClient";
import type { ApiResponse } from "../api/apiClient";

export interface PortfolioAsset {
  _id: string;
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
}

export interface Portfolio {
  _id: string;
  userId: string;
  assets: PortfolioAsset[];
  totalValue: number;
  totalInvestment: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdated: string;
}

export interface AssetTransaction {
  coinId: string;
  quantity: number;
  price: number;
  date: string;
  type: 'buy' | 'sell';
  notes?: string;
}

const portfolioService = {
    getPortfolio: async (): Promise<Portfolio> => {
      const response = await apiClient.get<ApiResponse<Portfolio>>('/portfolio');
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch portfolio');
      }
      // Check if data exists
      if (!response.data.data) {
        throw new Error('Portfolio data is missing from response');
      }
      return response.data.data;
    },
    
    addTransaction: async (transaction: AssetTransaction): Promise<Portfolio> => {
      const response = await apiClient.post<ApiResponse<Portfolio>>('/portfolio/transaction', transaction);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add transaction');
      }
      // Check if data exists
      if (!response.data.data) {
        throw new Error('Portfolio data is missing after transaction');
      }
      return response.data.data;
    },
    
    removeAsset: async (assetId: string): Promise<Portfolio> => {
      const response = await apiClient.delete<ApiResponse<Portfolio>>(`/portfolio/asset/${assetId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove asset');
      }
      // Check if data exists
      if (!response.data.data) {
        throw new Error('Portfolio data is missing after removing asset');
      }
      return response.data.data;
    }
  };

export default portfolioService;