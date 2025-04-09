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
      console.error('MongoDB connection error:', err);
    });
    
    return conn;
  } catch (error: unknown) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    // Don't exit the process on initial connection failure
    // Instead, return null so the application can handle it
    return null;
  }
};

export default connectDB;