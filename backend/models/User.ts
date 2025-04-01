import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  portfolio: mongoose.Schema.Types.ObjectId;
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
