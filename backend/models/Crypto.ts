import mongoose, { Schema, Document } from 'mongoose';

interface ICrypto extends Document {
  coinId: string;         // Unique identifier from CoinGecko API
  symbol: string;         // BTC, ETH, etc.
  name: string;           // Bitcoin, Ethereum, etc.
  image: string;          // URL to the coin's icon
  currentPrice?: number;   // Current price in USD
  marketCap?: number;      // Market cap in USD
  marketCapRank?: number;  // Rank by market cap
  priceChangePercentage24h: number;  // 24h price change percentage
  lastUpdated: Date;      // When the data was last fetched
}

const cryptoSchema: Schema = new Schema({
  coinId: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  currentPrice: { type: Number },
  marketCap: { type: Number },
  marketCapRank: { type: Number },
  priceChangePercentage24h: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
});

// Indexes for faster lookups
//cryptoSchema.index({ coinId: 1 });
cryptoSchema.index({ symbol: 1 });
cryptoSchema.index({ marketCapRank: 1 });

const Crypto = mongoose.model<ICrypto>('Crypto', cryptoSchema);

export default Crypto;