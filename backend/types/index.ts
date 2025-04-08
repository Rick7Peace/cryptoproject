import { Request, } from 'express';
import { Document } from 'mongoose';



export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    username?: string;
    role?: string;
    // Add any other user properties that controllers might need
  }
}

// You might also want to define your User interface if you use it elsewhere
export interface UserDocument extends Document {
  email: string;
  password: string;
  username?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  // Other methods you might have
}