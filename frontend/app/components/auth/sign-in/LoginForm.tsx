import React from 'react';
import { Link } from 'react-router';
import { useLoginForm } from '~/hooks/useLoginForm';
import FormInput from '@components/auth/reusable/FormInput';
import FormError from '@components/auth/reusable/FormError';
import SubmitButton from '@components/auth/reusable/SubmitButton';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { 
    formData, 
    validationErrors, 
    error, 
    isLoading, 
    handleChange, 
    handleSubmit 
  } = useLoginForm(onSubmit);

  // Icons for form inputs
  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const passwordIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      
      <FormError error={error} />
      
      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          placeholder="you@example.com"
          error={validationErrors.email}
          autoComplete="email"
          icon={emailIcon}
          onChange={handleChange}
        />
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Forgot password?
            </Link>
          </div>
          
          <FormInput
            id="password"
            name="password"
            type="password"
            label=""
            value={formData.password}
            placeholder="••••••••"
            error={validationErrors.password}
            autoComplete="current-password"
            icon={passwordIcon}
            onChange={handleChange}
      
          />
        </div>
        
        <div className="mb-6">
          <SubmitButton 
            isLoading={isLoading} 
            label="Sign In" 
            loadingLabel="Signing in..." 
          />
        </div>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;