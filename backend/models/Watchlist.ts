import mongoose, { Schema, Document } from 'mongoose';

interface IWatchlist extends Document {
  user: mongoose.Schema.Types.ObjectId;
  coins: mongoose.Schema.Types.ObjectId[];  // References to Crypto documents
  createdAt: Date;
  updatedAt: Date;
}

const watchlistSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  coins: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Crypto' 
  }],
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

const Watchlist = mongoose.model<IWatchlist>('Watchlist', watchlistSchema);

export default Watchlist;