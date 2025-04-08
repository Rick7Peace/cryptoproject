import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import cryptoRoutes from './routes/cryptoRoutes';
import watchlistRoutes from './routes/watchlistRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Body parsing middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Don't export the app - this is a common source of circular dependencies
