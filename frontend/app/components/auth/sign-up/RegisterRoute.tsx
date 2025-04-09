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
      await register({
        email: email,
       password: password,
        confirmPassword: confirmPassword,
        username: username || ''
      });
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Account created successfully! Please sign in.' }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/crypto-pattern.png')] opacity-10 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-20 w-24 h-24 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-20 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Join Our Platform</h1>
          <p className="mt-2 text-gray-300">Create an account to get started</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400 text-red-100 rounded-lg text-center">{error}</div>}
        
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default Register;