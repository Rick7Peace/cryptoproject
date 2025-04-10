/**
 * Centralized authentication service with API calls
 */
import apiClient from "../api/apiClient";
import type { ApiResponse } from "../api/apiClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Extended user interface with more fields
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  createdAt?: string;
  preferences?: {
    currency: string;
    theme: string;
    notifications: boolean;
  };
  [key: string]: any;
}

// Original response type (maintaining backward compatibility)
export interface AuthResponse {
  user: User;
  token: string;
}

// New response type for login/register endpoints
export interface TokenAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Validate an authentication token
 */
export async function validateToken(token: string): Promise<AuthResponse | null> {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success || !response.data.data) return null;
    
    return {
      user: response.data.data, // Removed unnecessary ! assertion
      token
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

/**
 * Refresh an expired token using a refresh token
 */
export async function refreshToken(refreshToken: string): Promise<{accessToken: string, refreshToken: string} | null> {
  try {
    const response = await apiClient.post<ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>>('/auth/refresh-token', { refreshToken });
    
    if (!response.data.success || !response.data.data) return null;
    
    return {
      accessToken: response.data.data.accessToken, // Removed unnecessary ! assertion
      refreshToken: response.data.data.refreshToken // Removed unnecessary ! assertion
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

/**
 * Complete authentication flow with token refresh
 */
export async function authenticateWithRefresh(): Promise<AuthResponse | null> {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  
  // Try to validate current token
  const validationResult = await validateToken(token);
  if (validationResult) return validationResult;
  
  // If token invalid, try refresh
  const refreshTokenValue = localStorage.getItem("refreshToken");
  if (!refreshTokenValue) return null;
  
  const refreshResult = await refreshToken(refreshTokenValue);
  if (!refreshResult) return null;
  
  // Store new tokens
  localStorage.setItem("accessToken", refreshResult.accessToken);
  localStorage.setItem("refreshToken", refreshResult.refreshToken);
  
  // Validate the new token
  return await validateToken(refreshResult.accessToken);
}

// New functionality as a service object
const authService = {
  validateToken,
  refreshToken,
  authenticateWithRefresh,
  
  /**
 * Register a new user
 */
  register: async (userData: RegisterData): Promise<TokenAuthResponse> => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...apiData } = userData;
    console.log('Sending registration data:', apiData);
    
    try {
      const response = await apiClient.post<ApiResponse<TokenAuthResponse>>('/auth/register', apiData);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      // Store tokens in localStorage
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response.data.data;
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      console.error('Response data:', error.response?.data);
      
      // More specific error handling
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.response?.statusText ||
        error.message ||
        'Registration failed';
        
      throw new Error(errorMessage);
    }
  },
  
  /**
 * Log in a user with email and password
 */
login: async (credentials: LoginCredentials): Promise<TokenAuthResponse> => {
  console.log('Login request URL:', `${API_BASE_URL}/auth/login`);
console.log('Frontend origin:', window.location.origin);
  try {
    console.log('Attempting login with:', {
      email: credentials.email,
      password: credentials.password ? '********' : 'missing'
    });

    const response = await apiClient.post<ApiResponse<TokenAuthResponse>>('/auth/login', credentials);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    // Store tokens in localStorage
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data.data;
  } catch (error: any) {
    console.error('Full login error object:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    console.error('Response data:', error.response?.data);
    
    // More specific error handling
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message ||
      'Login failed';
      
    throw new Error(errorMessage);
  }
},
  
  /**
   * Log out the current user
   */
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post<ApiResponse<void>>('/auth/logout', { refreshToken });
      }
    } finally {
      // Always clear localStorage on logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  
  /**
   * Check if user is authenticated and get user data
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null; // Add return statement here
      
      const response = await apiClient.get<ApiResponse<User>>('/auth/validate');
      if (!response.data.success || !response.data.data) return null;
      
      return response.data.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

/**
   * Update user profile information
   */
updateProfile: async (profileData: Partial<User>): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/auth/profile', profileData);
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update profile');
  }
  
  return response.data.data;
},

/**
 * Change user password
 */
changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
  const response = await apiClient.put<ApiResponse<void>>('/auth/password', {
    currentPassword,
    newPassword
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to change password');
  }
}



};

export default authService;