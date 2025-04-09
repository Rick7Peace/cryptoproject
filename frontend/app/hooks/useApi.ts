import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/errorHandler';

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction(...args);
        
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const appError = handleApiError(err);
        setError(appError);
        options.onError?.(appError);
        throw appError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { execute, data, loading, error };
}