import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../../context/AuthContext';
import { validateRegistrationForm } from '../../../utils/authValidation';




const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleRegister = async (
    email: string,
    password: string,
    confirmPassword: string,
    username?: string
  ) => {
    // Validate form inputs
    const validation = validateRegistrationForm(email, password, confirmPassword, username);
    if (!validation.isValid) {
      // Get first error message
      const firstError = Object.values(validation.errors).find(msg => msg !== '');
      setError(firstError || 'Invalid registration details');
      return;
    }
    
    try {
      setError(null);
      await register(email, password, username || '');
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Account created successfully! Please sign in.' }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Create Your Account</h1>
        {error && <div className="auth-error">{error}</div>}
        <RegisterForm onSubmit={handleRegister} />
        <div className="auth-links">
          <a href="/login">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;