// This file contains TypeScript interfaces and types for user authentication
// and authorization, including user data structure, authentication responses,

/**
 * User interface that matches the backend model structure
 */
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  isVerified: boolean;
  portfolio?: string;
  watchlist?: string;
  createdAt: string;
  lastLogin?: string;
  preferences: {
    currency: string;
    theme: string;
    notifications: boolean;
  };
}

// Authentication response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Enhanced auth response with user data
export interface TokenAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Login/Register request types
export interface LoginRequest {
  email: string;
  password: string;
}

// Alias for improved readability in service functions
export type LoginCredentials = LoginRequest;

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Extended register request with password confirmation
export type RegisterData = RegisterRequest & { confirmPassword: string };

// Form validation error types
export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Password reset types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Authorization types
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