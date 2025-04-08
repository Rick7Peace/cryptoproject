import mongoose, { Schema, Document } from 'mongoose';

interface IPortfolioEntry {
  crypto: mongoose.Schema.Types.ObjectId;  // Reference to Crypto document
  quantity: number;                       // Amount of coins owned
  averageBuyPrice: number;                // Average purchase price
  transactions: mongoose.Schema.Types.ObjectId[];  // References to Transaction documents
}

interface IPortfolio extends Document {
  user: mongoose.Schema.Types.ObjectId;    // Reference to User document
  holdings: IPortfolioEntry[];             // List of crypto holdings
  totalValue: number;                      // Total value of portfolio (cached)
  lastUpdated: Date;                       // When the portfolio value was last calculated
}

const portfolioEntrySchema: Schema = new Schema({
  crypto: { type: Schema.Types.ObjectId, ref: 'Crypto', required: true },
  quantity: { type: Number, required: true, min: 0 },
  averageBuyPrice: { type: Number, default: 0 },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [{
    crypto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crypto',
      required: true
    },
    quantity: Number,
    averageBuyPrice: Number,
    transactions: Array
  }],
  totalValue: Number,
  lastUpdated: Date
});

const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

export default Portfolio;
