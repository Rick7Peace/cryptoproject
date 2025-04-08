
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

export default authorizationApi;