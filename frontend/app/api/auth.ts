
// Define the AuthResponse type
export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
}
import axios  from 'axios';
import type { User as AuthUser } from './index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Define types for authorization
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface UserPermissions {
  userId: string;
  roles: Role[];
  permissions: Permission[];
}

const API_URL = '/api/authorization';

/**
 * Authorization API service
 */
export const authorizationApi = {
  /**
   * Get all permissions for the current user
   */
  getUserPermissions: async (token: string): Promise<UserPermissions> => {
    const response = await fetch(`${API_URL}/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user permissions');
    }
    
    return data;
  },
  
  /**
   * Check if user has a specific permission
   */
  hasPermission: async (token: string, permissionName: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/check-permission/${permissionName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check permission');
    }
    
    return data.hasPermission;
  },
  
  /**
   * Check if user has a specific role
   */
  hasRole: async (token: string, roleName: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/check-role/${roleName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check role');
    }
    
    return data.hasRole;
  },
  
  /**
   * Get all available roles in the system
   */
  getAllRoles: async (token: string): Promise<Role[]> => {
    const response = await fetch(`${API_URL}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch roles');
    }
    
    return data;
  },
  
  /**
   * Assign role to a user
   */
  assignRole: async (token: string, userId: string, roleId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/assign-role`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ userId, roleId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to assign role');
    }
  },
  
  /**
   * Remove role from a user
   */
  removeRole: async (token: string, userId: string, roleId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/remove-role`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ userId, roleId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove role');
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
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
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
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
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
  logout: async (token: string): Promise<{ success: boolean }> => {
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
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (token: string): Promise<AuthUser> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
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