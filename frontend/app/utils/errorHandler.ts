import { AxiosError } from 'axios';
import type { ApiResponse } from '../api/apiClient';

export class AppError extends Error {
  statusCode: number;
  errors?: Record<string, string>;
  
  constructor(message: string, statusCode = 500, errors?: Record<string, string>) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiResponse;
    return new AppError(
      data.message || 'An error occurred',
      error.response.status,
      data.errors
    );
  }
  
  if (error instanceof Error) {
    return new AppError(error.message);
  }
  
  return new AppError('An unknown error occurred');
};