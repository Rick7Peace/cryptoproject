import mongoose, { Schema, Document } from 'mongoose';

interface IPortfolio extends Document {
  cryptoAssets: Array<{
    name: string;
    amount: number;
    price: number;
  }>;
}

const portfolioSchema: Schema = new Schema({
  cryptoAssets: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

export default Portfolio;
