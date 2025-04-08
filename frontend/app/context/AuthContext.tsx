import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create safe browser storage utilities
const isBrowser = typeof window !== 'undefined';

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }
};

// Define types for authentication
interface User {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  validateResetToken: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null,
  refreshToken: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  resetPassword: async () => {},
  validateResetToken: async () => {},
  requestPasswordReset: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize with null token for SSR safety
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    token: null,
    refreshToken: null,
  });

  // Check if user is logged in on initial client-side load only
  useEffect(() => {
    const token = safeLocalStorage.getItem('accessToken');
    const refreshToken = safeLocalStorage.getItem('refreshToken');
    
    // Update state with token from localStorage after component mounts
    setAuthState(prev => ({
      ...prev,
      token,
      refreshToken,
      isLoading: !!token
    }));

    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthState({
            user: userData.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token,
            refreshToken,
          });
        } else {
          // Try to refresh token
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
              });
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                safeLocalStorage.setItem('accessToken', refreshData.accessToken);
                safeLocalStorage.setItem('refreshToken', refreshData.refreshToken);
                
                // Fetch user data with new token
                const userResponse = await fetch(`${API_BASE_URL}/auth/validate`, {
                  headers: { Authorization: `Bearer ${refreshData.accessToken}` }
                });
                
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  setAuthState({
                    user: userData.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                    token: refreshData.accessToken,
                    refreshToken: refreshData.refreshToken,
                  });
                  return;
                }
              }
            } catch (error) {
              console.error('Token refresh error:', error);
            }
          }
          
          // If refresh failed or no refresh token, clear auth
          safeLocalStorage.removeItem('accessToken');
          safeLocalStorage.removeItem('refreshToken');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null,
            refreshToken: null,
          });
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Failed to validate authentication',
        }));
      }
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      safeLocalStorage.setItem('accessToken', data.accessToken);
      safeLocalStorage.setItem('refreshToken', data.refreshToken);
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          username: name // Map name to username for the API
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const data = await response.json();
      
      safeLocalStorage.setItem('accessToken', data.accessToken);
      safeLocalStorage.setItem('refreshToken', data.refreshToken);
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (authState.token) {
        // Call logout API endpoint
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.token}`
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      safeLocalStorage.removeItem('accessToken');
      safeLocalStorage.removeItem('refreshToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,
      });
    }
  };

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Password reset functions
  const requestPasswordReset = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to request password reset');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to request password reset',
      }));
      throw error;
    }
  };

  const validateResetToken = async (token: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/auth/validate-reset-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Invalid or expired reset token');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Invalid or expired reset token',
      }));
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to reset password',
      }));
      throw error;
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...authState,
    login,
    register,
    logout,
    clearError,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
  }), [
    authState, 
    login, 
    register, 
    logout, 
    clearError, 
    requestPasswordReset,
    validateResetToken,
    resetPassword
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;