import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/connection';
import authRoutes from './routes/authRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import cryptoRoutes from './routes/cryptoRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Add CORS middleware before your routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://cryptotrack-oitv.onrender.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this route after your middleware and before other routes
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB Atlas using the modular connection file
connectDB()
  .then(() => {
    console.log('MongoDB Atlas connection established successfully');
    
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/portfolio', portfolioRoutes);
    app.use('/api/crypto', cryptoRoutes);
    app.use('/api/watchlist', watchlistRoutes);
    
    // Static File Serving Configuration
    if (process.env.NODE_ENV === 'production') {
      // Production mode: Serve from client/build
      const staticPath = path.join(__dirname, '../client/build');
      console.log(`Serving static files from: ${staticPath}`);
      
      app.use(express.static(staticPath));
      
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
      });
    } else {
      // Development mode: API status endpoint
      app.get('/', (_req, res) => {
        res.json({ 
          status: 'API is running', 
          mode: process.env.NODE_ENV || 'development',
          mongodb: 'connected'
        });
      });
    }
    
    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`http://localhost:${PORT}`);
    });
    
    // Handle server shutdown gracefully
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server closed. Database connections cleaned.');
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    // Safely log error without passing the full object that might contain URL strings
    console.error('Failed to connect to MongoDB Atlas:', error.name || 'Connection error');
    
    // Set up basic routes for error state
    app.get('/health', (_req, res) => {
      res.status(503).json({
        success: false,
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      });
    });
    
    // Start server even if DB connection fails
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in limited mode (no DB connection) on port ${PORT}`);
    });
  });