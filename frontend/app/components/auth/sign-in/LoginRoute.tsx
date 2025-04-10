import React from 'react';
import { Link } from 'react-router'; // Updated based on your route config
import LoginForm from './LoginForm';
import AuthLayout from '../AuthLayout';
import { useLoginRoute } from '~/hooks/useLoginRoute';
import Alert from '@components/auth/reusable/Alert';

const Login: React.FC = () => {
  const { error, handleLogin, isServerAvailable } = useLoginRoute();

  return (
    <>
      <AuthLayout 
        title="Welcome Back!"
        subtitle="Sign in to access your account"
        error={error}
      >
        <div className="relative">
          {!isServerAvailable && (
            <Alert 
              type="warning" 
              message="Server connection issues detected. Some features may be unavailable."
              className="mb-4" 
            />
          )}
          <div className="relative">
            {/* X icon positioned at the top right inside the form */}
            <div className="absolute top-4 right-4 z-30">
              <Link 
                to="/" 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <LoginForm onSubmit={handleLogin} />
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;