import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/authValidation';

export const useLoginRoute = () => {
  const [error, setError] = useState<string | null>(null);
  const [isServerAvailable, setIsServerAvailable] = useState<boolean>(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect destination
  const from = location.state?.from || '/dashboard';
  
  const handleLogin = async (email: string, password: string) => {
    // Reset previous errors
    setError(null);
    
    // Form validation logic
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors).find(msg => msg !== '');
      setError(firstError || 'Invalid login details');
      return;
    }
    
    // Check server availability before attempting login
    if (!isServerAvailable) {
      setError('Server appears to be offline. Please try again later.');
      return;
    }
    
    // API communication logic with timeout
    try {
      // Create a promise that rejects after 10 seconds
      const loginPromise = login({ email, password });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login request timed out')), 10000);
      });
      
      // Race the login against the timeout
      await Promise.race([loginPromise, timeoutPromise]);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error types
      if (!navigator.onLine) {
        setError('You appear to be offline. Please check your internet connection.');
      } else if (err.message === 'Login request timed out') {
        setError('Server is taking too long to respond. Please try again later.');
      } else if (err.status === 401 || err.status === 403) {
        setError('Incorrect email or password. Please try again.');
      } else if (err.status >= 500) {
        setError('Server error. Our team has been notified.');
        // Here you could also log the error to a monitoring service
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    }
  };

  // Server health check
  useEffect(() => {
    const testDirectFetch = async () => {
      try {
        console.log("Testing direct fetch to server...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch("http://localhost:5000/health", {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const data = await response.text();
        console.log("Direct fetch response:", data);
        setIsServerAvailable(true);
      } catch (error: any) {
        console.error("Direct fetch failed:", error);
        setIsServerAvailable(false);
        
        // Set appropriate error message if server is unreachable
        if (error.name === 'AbortError') {
          setError('Server response timeout. Please try again later.');
        } else {
          setError('Unable to connect to server. Please check your connection or try again later.');
        }
      }
    };
    
    testDirectFetch();
  }, []);

  return { 
    error, 
    handleLogin, 
    isServerAvailable 
  };
};