import type { User, AuthResponse,  Role, UserPermissions } from '../types/authTypes';
import apiClient from './apiClient';


/**
 * Authorization API service
 */
export const authorizationApi = {
  /**
   * Get all permissions for the current user
   */
  getUserPermissions: async (): Promise<UserPermissions> => {
    try {
      const response = await apiClient.get('/authorization/permissions');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user permissions');
    }
  },
  
  /**
   * Check if user has a specific permission
   */
  hasPermission: async (permissionName: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/authorization/check-permission/${permissionName}`);
      return response.data.data.hasPermission;
    } catch (error: any) {
      console.error(`Permission check failed for ${permissionName}:`, error);
      // Return false instead of throwing error to prevent unauthorized state
      return false;
    }
  },
  
  hasRole: async (roleName: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/authorization/check-role/${roleName}`);
      return response.data.data.hasRole;
    } catch (error: any) {
      console.error(`Role check failed for ${roleName}:`, error);
      // Return false instead of throwing error
      return false;
    }
  },
  
  /**
   * Get all available roles in the system
   */
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await apiClient.get('/authorization/roles');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  },
  
  /**
   * Assign role to a user
   */
  assignRole: async (userId: string, roleId: string): Promise<void> => {
    try {
      await apiClient.post('/authorization/assign-role', { userId, roleId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to assign role');
    }
  },
  
  /**
   * Remove role from a user
   */
  removeRole: async (userId: string, roleId: string): Promise<void> => {
    try {
      await apiClient.post('/authorization/remove-role', { userId, roleId });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove role');
    }
  }
};

/**
 * Authentication API service
 */
const authApi = {
  /**
   * Register a new user
   */
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      console.log('Sending registration data:', userData);
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  /**
   * Log in a user
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (token: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    try {
      // Don't use apiClient here to avoid infinite loop with interceptor
      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken: token
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  /**
   * Log out a user
   */
  logout: async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post('/auth/logout', {});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/auth/validate');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user profile');
      }
      
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }
};

export default authApi;