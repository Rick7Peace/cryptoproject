import React from 'react';
import { Link } from 'react-router';
import { useRegisterForm } from '~/hooks/UseRegisterForm';
import FormInput from '@components/auth/reusable/FormInput';
import FormError from '@components/auth/reusable/FormError';
import SubmitButton from '@components/auth/reusable/SubmitButton';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegisterForm: React.FC = () => {
  const { 
    formData, 
    validationErrors, 
    error, 
    isLoading, 
    passwordStrength,
    handleChange, 
    handleSubmit 
  } = useRegisterForm();

  // Icons for form inputs
  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

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

  const confirmIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944A11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
      
      <FormError error={error} />
      
      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Username"
          value={formData.name}
          placeholder="johndoe"
          error={validationErrors.username}
          autoComplete="username"
          icon={userIcon}
          onChange={handleChange}
        />
        
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
        
        <div className="mb-4">
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            placeholder="••••••••"
            error={validationErrors.password}
            autoComplete="new-password"
            icon={passwordIcon}
            onChange={handleChange}
          />
          
          {formData.password && (
            <PasswordStrengthIndicator strength={passwordStrength} />
          )}
        </div>
        
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          placeholder="••••••••"
          error={validationErrors.confirmPassword}
          autoComplete="new-password"
          icon={confirmIcon}
          onChange={handleChange}
        />
        
        <div className="mb-6">
          <SubmitButton 
            isLoading={isLoading} 
            label="Create Account" 
            loadingLabel="Creating Account..." 
          />
        </div>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;