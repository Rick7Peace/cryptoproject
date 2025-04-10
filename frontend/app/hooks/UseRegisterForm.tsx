import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@context/AuthContext';
import { getPasswordStrength } from '@utils/authValidation';
import type { RegisterData, RegisterFormErrors } from '~/types/authTypes';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<RegisterFormErrors>({});
  const { register, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = (): boolean => {
    const errors: RegisterFormErrors = {};
    
    // Validate name (will be used as username)
    if (!formData.name.trim()) {
      errors.username = 'Username is required';
    }
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when typing
    if (validationErrors[name as keyof RegisterFormErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear API error when user starts typing again
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Map formData to RegisterData structure
      const registerData: RegisterData = {
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        // Optional fields - only include if they have values
        ...(formData.firstName && { firstName: formData.firstName.trim() }),
        ...(formData.lastName && { lastName: formData.lastName.trim() })
      };

      await register(registerData);
      navigate('/dashboard'); // Navigate on success
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled by useAuth
    }
  };

  return {
    formData,
    validationErrors,
    error,
    isLoading,
    passwordStrength,
    handleChange,
    handleSubmit
  };
};