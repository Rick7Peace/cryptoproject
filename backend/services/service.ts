import mongoose from 'mongoose';
import { ApiError } from '../utils/errorHandler';

/**
 * BaseService provides common CRUD operations and utility methods
 * that can be extended by specific service classes
 */
export class BaseService<T extends mongoose.Document> {
  protected model: mongoose.Model<T>;
  
  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }
  
  /**
   * Create a new document
   */
  async create(data: any): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Find a document by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Find documents by criteria
   */
  async find(criteria: object = {}, limit: number = 10, skip: number = 0): Promise<T[]> {
    try {
      return await this.model.find(criteria).limit(limit).skip(skip);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Update a document by ID
   */
  async update(id: string, data: any): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Delete a document by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Error handler helper
   */
  protected handleError(error: any): Error {
    console.error('Service error:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return new ApiError(Object.values(error.errors)[0].message, 400);
    }
    
    if (error.code === 11000) { // Duplicate key error
      return new ApiError('Duplicate entry found', 409);
    }
    
    if (error instanceof ApiError) {
      return error;
    }
    
    return new ApiError('Internal service error', 500);
  }
}

/**
 * Utility functions that can be used across services
 */
export const serviceUtils = {
  /**
   * Check if a string is a valid ObjectId
   */
  isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  },
  
  /**
   * Format a date in a consistent way
   */
  formatDate(date: Date): string {
    return date.toISOString();
  },
  
  /**
   * Handle pagination parameters
   */
  getPaginationParams(page?: string, limit?: string): { skip: number, limit: number, page: number } {
    const parsedPage = parseInt(page || '1', 10);
    const parsedLimit = parseInt(limit || '10', 10);
    
    return {
      page: parsedPage > 0 ? parsedPage : 1,
      limit: parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 10,
      skip: (parsedPage - 1) * parsedLimit
    };
  }
};