import React from 'react';
import LoginForm from './LoginForm';
import AuthLayout from '../AuthLayout';
import { useLoginRoute } from '~/hooks/useLoginRoute';
import Alert from '@components/auth/reusable/Alert'; // Create this component if it doesn't exist

const Login: React.FC = () => {
  const { error, handleLogin, isServerAvailable } = useLoginRoute();

  return (
    <AuthLayout 
      title="Welcome Back!"
      subtitle="Sign in to access your account"
      error={error}
    >
      {!isServerAvailable && (
        <Alert 
          type="warning" 
          message="Server connection issues detected. Some features may be unavailable."
          className="mb-4" 
        />
      )}
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
};

export default Login;