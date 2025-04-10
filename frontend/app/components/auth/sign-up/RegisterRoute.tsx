import React from 'react';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../../context/AuthContext';

/**
 * Register route component that serves as the container for the registration page
 * This component handles the layout and UI elements around the form
 */
const RegisterRoute: React.FC = () => {
  const { error } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-20 w-24 h-24 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-20 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Join Our Platform</h1>
          <p className="mt-2 text-gray-300">Create an account to get started</p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterRoute;