import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';
import type { 
  User, 
  LoginCredentials, 
  RegisterData 
} from '../types/authTypes';

// Define your context types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: true,
    error: null as string | null,
    token: null as string | null
  });

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await authService.authenticateWithRefresh();
        if (authResult) {
          setState({
            user: authResult.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            // Fix: Use accessToken property from TokenAuthResponse
            token: authResult.accessToken || null
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Authentication failed"
        }));
      }
    };

    checkAuth();
  }, []);

  // Handle login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.login(credentials);
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: result.accessToken || null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed"
      }));
      throw error;
    }
  }, []);

  // Implement other methods with useCallback
  const register = useCallback(async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await authService.register(data);
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: result.accessToken || null
      });
    } catch (error) {
      console.error('Detailed registration error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed"
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed"
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const updatedUser = await authService.updateProfile(data);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Profile update failed"
      }));
      throw error;
    }
  }, []);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    clearError,
    updateProfile
  }), [state, login, register, logout, clearError, updateProfile]);

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