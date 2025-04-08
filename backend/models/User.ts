import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  isVerified: boolean;
  portfolio: mongoose.Schema.Types.ObjectId;
  watchlist: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  lastLogin?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  preferences: {
    currency: string;
    theme: string;
    notifications: boolean;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  portfolio: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
  watchlist: { type: Schema.Types.ObjectId, ref: 'Watchlist' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  refreshToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  preferences: {
    currency: { type: String, default: 'USD' },
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Pre-save hook to hash passwords
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
