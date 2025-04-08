//frontend\app\context



import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';

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
  id: string;
  email: string;
  name: string;
  permissions?: any[];
  roles?: any[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
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
    token: null, // Initialize as null, will be populated in useEffect
  });

  // Check if user is logged in on initial client-side load only
  useEffect(() => {
    const token = safeLocalStorage.getItem('token');
    
    // Update state with token from localStorage after component mounts
    setAuthState(prev => ({
      ...prev,
      token,
      isLoading: !!token
    }));

    if (!token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token,
          });
        } else {
          safeLocalStorage.removeItem('token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null,
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
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      safeLocalStorage.setItem('token', data.token);
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: data.token,
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

  const register = async (email: string, password: string, name?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      safeLocalStorage.setItem('token', data.token);
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: data.token,
      });
    } catch (error: any) {
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
      // Call logout API endpoint (optional)
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authState.token}` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      safeLocalStorage.removeItem('token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
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
      
      const response = await fetch('/api/auth/forgot-password', {
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
    // Implementation as before...
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // Implementation as before...
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