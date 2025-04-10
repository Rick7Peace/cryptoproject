import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useLoginForm = (onSubmit: (email: string, password: string) => Promise<void>) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const { error, isLoading, clearError } = useAuth();

  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      password?: string;
    } = {};
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear API error when user starts typing again
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return {
    formData,
    validationErrors,
    error,
    isLoading,
    handleChange,
    handleSubmit
  };
};