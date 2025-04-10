/**
 * Centralized authentication service with API calls
 */
import apiClient from "../api/apiClient";
import type { ApiResponse } from "../api/apiClient";
import type { 
  User,  
  TokenResponse,
  LoginCredentials,
  RegisterData,
  TokenAuthResponse
} from "../types/authTypes";
import storageService from './storageService';


/**
 * Validate an authentication token
 */
export async function validateToken(token: string): Promise<TokenAuthResponse | null> {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success || !response.data.data) return null;
    
    // Use storage service instead of direct localStorage access
    const { refreshToken } = storageService.getAuthData();
    
    return {
      user: response.data.data,
      accessToken: token,
      refreshToken: refreshToken || ''
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

/**
 * Refresh an expired token using a refresh token
 */
export async function refreshToken(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/refresh-token', { refreshToken });
    
    if (!response.data.success || !response.data.data) return null;
    
    return response.data.data;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

/**
 * Complete authentication flow with token refresh
 */
export async function authenticateWithRefresh(): Promise<TokenAuthResponse | null> {
  // Use storage service instead of direct localStorage access
  const { accessToken: token, refreshToken: refreshTokenValue } = storageService.getAuthData();
  
  if (!token) return null;
  
  // Try to validate current token
  const validationResult = await validateToken(token);
  if (validationResult) return validationResult;
  
  // If token invalid, try refresh
  if (!refreshTokenValue) return null;
  
  const refreshResult = await refreshToken(refreshTokenValue);
  if (!refreshResult) return null;
  
  // Store new tokens using storage service
  storageService.setAuthData(
    refreshResult.accessToken,
    refreshResult.refreshToken,
    storageService.getAuthData().user
  );
  
  // Validate the new token
  return await validateToken(refreshResult.accessToken);
}

// Service object with all auth functionality
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
      
      // Handle success check
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || 'Registration failed');
      }
  
      // Extract data, handling both response structures
      const responseData = (response.data.data || response.data) as TokenAuthResponse;
      
      // Validate required fields exist
      if (!responseData.user || !responseData.accessToken || !responseData.refreshToken) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Registration successful but response format is invalid');
      }
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', responseData.accessToken);
      localStorage.setItem('refreshToken', responseData.refreshToken);
      
      return {
        user: responseData.user,
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken
      };
    } catch (error: any) {
      console.error('Registration error details:', error.response?.data);
      
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
    try {
      const response = await apiClient.post<ApiResponse<TokenAuthResponse>>('/auth/login', credentials);
      
      // Handle success check
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      // Extract data, handling both response structures
      const responseData = (response.data.data || response.data) as TokenAuthResponse;
      
      // Validate required fields exist
      if (!responseData.user || !responseData.accessToken || !responseData.refreshToken) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Login successful but response format is invalid');
      }
      
      // Use centralized storage service
      storageService.setAuthData(
        responseData.accessToken,
        responseData.refreshToken,
        responseData.user
      );
      
      return {
        user: responseData.user,
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken
      };
    } catch (error: any) {
      console.error('Login error details:', error.response?.data);
      
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
      const { refreshToken } = storageService.getAuthData();
      if (refreshToken) {
        await apiClient.post<ApiResponse<void>>('/auth/logout', { refreshToken });
      }
    } finally {
      // Use centralized storage service
      storageService.clearAuthData();
    }
  },
  
  /**
   * Check if user is authenticated and get user data
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
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