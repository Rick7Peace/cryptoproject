import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import storageService from '../services/storageService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cryptotrack-api-ezlm.onrender.com/api';

// Standard response type for all API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = storageService.getAuthData();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refreshToken } = storageService.getAuthData();
        if (!refreshToken) throw new Error('No refresh token available');
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, 
          { refreshToken }, 
          { headers: { 'Content-Type': 'application/json' }}
        );
        
        if (!response.data.accessToken) throw new Error('Token refresh failed');
        
        // Store new tokens with centralized service
        storageService.setAuthData(
          response.data.accessToken,
          response.data.refreshToken,
          storageService.getAuthData().user
        );
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // On refresh failure, clear tokens and redirect to login
        storageService.clearAuthData();
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;