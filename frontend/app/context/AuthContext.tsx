import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';
import type { 
  User, 
  LoginCredentials, 
  RegisterData 
} from '../types/authTypes';
import storageService from '../services/storageService';

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
  // Initialize state from storage service instead of direct localStorage access
  const { accessToken, user } = storageService.getAuthData();
  
  const [state, setState] = useState({
    user: user as User | null,
    isAuthenticated: !!accessToken,
    isLoading: true,
    error: null as string | null,
    token: accessToken
  });

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication on app load...");
      try {
        // Get token from storage service
        const { accessToken } = storageService.getAuthData();
        console.log("Token from storage:", accessToken ? "exists" : "not found");
        
        const authResult = await authService.authenticateWithRefresh();
        console.log("Auth result:", authResult ? "authenticated" : "not authenticated");
        
        if (authResult) {
          console.log("Setting authenticated state");
          setState({
            user: authResult.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token: authResult.accessToken || null
          });
        } else {
          console.log("Setting unauthenticated state");
          setState(prev => ({ 
            ...prev, 
            isAuthenticated: false,
            isLoading: false,
            token: null
          }));
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          error: "Authentication failed",
          token: null
        }));
      }
    };

    // Check if storage is available before proceeding
    if (storageService.isStorageAvailable()) {
      checkAuth();
    } else {
      console.error("LocalStorage is not available");
      setState(prev => ({
        ...prev, 
        isLoading: false,
        error: "Storage not available"
      }));
    }
  }, []);

  // Add storage event listener for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        if (event.newValue === null) {
          // Another tab logged out
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null
          });
        } else if (event.oldValue !== event.newValue) {
          // Another tab logged in or refreshed token
          const { user } = storageService.getAuthData();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token: event.newValue
          });
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Add session timeout detection
  useEffect(() => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    if (state.isAuthenticated) {
      const checkSessionTimeout = () => {
        const { timestamp } = storageService.getAuthData();
        
        if (timestamp && Date.now() - timestamp > SESSION_TIMEOUT) {
          console.log("Session timed out due to inactivity");
          logout();
        }
      };
      
      // Check session timeout every minute
      const intervalId = setInterval(checkSessionTimeout, 60000);
      
      // Update timestamp on user activity
      const updateTimestamp = () => {
        if (state.isAuthenticated) {
          storageService.updateAuthTimestamp();
        }
      };
      
      // Listen for user activity
      window.addEventListener('click', updateTimestamp);
      window.addEventListener('keypress', updateTimestamp);
      window.addEventListener('mousemove', updateTimestamp);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          updateTimestamp();
        }
      });
      
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('click', updateTimestamp);
        window.removeEventListener('keypress', updateTimestamp);
        window.removeEventListener('mousemove', updateTimestamp);
        document.removeEventListener('visibilitychange', updateTimestamp);
      };
    }
  }, [state.isAuthenticated]);

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
      
      // Update both user state and storage
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
      
      // Update user data in storage
      storageService.updateUserData(updatedUser);
      
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