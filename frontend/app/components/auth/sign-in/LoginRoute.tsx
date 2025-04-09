import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import LoginForm from './LoginForm';
import AuthLayout from '../AuthLayout';
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
      await login({
        email: email,
       password: password
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back!"
      subtitle="Sign in to access your account"
      error={error}
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
};

export default Login;