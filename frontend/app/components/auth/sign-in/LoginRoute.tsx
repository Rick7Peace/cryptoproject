import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import LoginForm from './LoginForm';
import { useAuth } from '../../../context/AuthContext';
import { validateLoginForm } from '../../../utils/authValidation';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect destination if user was redirected to login
  const from = location.state?.from || '/dashboard';
  
  const handleLogin = async (email: string, password: string) => {
    // Validate form inputs
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      // Get first error message
      const firstError = Object.values(validation.errors).find(msg => msg !== '');
      setError(firstError || 'Invalid login details');
      return;
    }
    
    try {
      setError(null);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Sign In to Your Account</h1>
        {error && <div className="auth-error">{error}</div>}
        <LoginForm onSubmit={handleLogin} />
        <div className="auth-links">
          <a href="/forgot-password">Forgot password?</a>
          <div className="auth-separator" />
          <a href="/register">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;