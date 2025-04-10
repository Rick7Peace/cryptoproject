import { Request } from 'express';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string | null;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}