// User related types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Authentication state
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  // Login request/response types
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  // Registration request/response types
  export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
  }
  
  export interface RegisterResponse {
    token: string;
    user: User;
  }
  
  // Form validation types
  export interface LoginFormErrors {
    email?: string;
    password?: string;
  }
  
  export interface RegisterFormErrors {
    name?: string;
    email?: string;  
    password?: string;
    confirmPassword?: string;
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