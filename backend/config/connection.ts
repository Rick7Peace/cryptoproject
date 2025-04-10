import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      // These options help with connection reliability
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // connection event handlers
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      // Sanitize error output to prevent path-to-regexp issues
      console.error('MongoDB connection error:', err.name || 'Connection error');
    });
    
    return conn;
  } catch (error: unknown) {
    // Sanitize error output - don't log full error objects that might contain URLs
    const errorName = error instanceof Error ? error.name : 'Unknown error';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log a sanitized version that won't cause path-to-regexp issues
    console.error(`Database connection error: ${errorName}`);
    
    // Don't exit the process on initial connection failure
    // Instead, return null so the application can handle it
    throw { name: errorName, message: 'Failed to connect to database' };
  }
};

export default connectDB;