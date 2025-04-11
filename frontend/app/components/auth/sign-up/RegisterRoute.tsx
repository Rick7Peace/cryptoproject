import React from 'react';
import { Link } from 'react-router'
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
        
        <div className="absolute top-30 right-5 z-30">
              <Link 
                to="/" 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
        
        <RegisterForm />

        
      </div>
    </div>
  );
};

export default RegisterRoute;