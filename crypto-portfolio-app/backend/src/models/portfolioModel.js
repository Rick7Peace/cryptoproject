import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cryptocurrencies: [
    {
      name: {
        type: String,
        required: true,
      },
      amountHeld: {
        type: Number,
        required: true,
      },
      purchasePrice: {
        type: Number,
        required: true,
      },
      transactionHistory: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          type: {
            type: String,
            enum: ['buy', 'sell'],
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;