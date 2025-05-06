import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { getTopCryptos, getCryptoPrices } from '~/services/cryptoService';
import type { Crypto } from '~/types/cryptoTypes';
import ErrorAlert from '~/components/dashboard/ErrorAlert';
import { useAuth } from '~/context/AuthContext';

const LandingHero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trendingCoins, setTrendingCoins] = useState<Crypto[]>([]);
  const [displayCoins, setDisplayCoins] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval] = useState<number>(30); // Changed to 30 seconds
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Refs to prevent unnecessary re-renders
  const prevPricesRef = useRef<Record<string, number>>({});
  const trendingCoinsRef = useRef<Crypto[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store current coins in ref without triggering re-renders
  useEffect(() => {
    trendingCoinsRef.current = trendingCoins;
  }, [trendingCoins]);

  // Separate initial data fetch from price updates
  const fetchTrendingCoins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getTopCryptos(4);
      console.log('Fetched Trending Coins:', response); // Debugging line

      if (!response || response.length === 0) {
        throw new Error('No trending coins available');
      }

      setTrendingCoins(response);
      setDisplayCoins(response);
    } catch (err) {
      console.error('Failed to fetch trending coins:', err);
      setError('Could not load cryptocurrency data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to update prices only with buffering
  const updatePrices = useCallback(async () => {
    // Skip if we're already refreshing or no coins exist
    if (isRefreshing || trendingCoinsRef.current.length === 0) return;
    
    // Enforce minimum time between updates (buffer)
    const now = Date.now();
    if (now - lastFetchTime < 15000) { // At least 15 seconds between refreshes
      console.log('Skipping update, too soon since last refresh');
      return;
    }
    
    setIsRefreshing(true);
    try {
      console.log('Updating crypto prices at', new Date().toLocaleTimeString());
      const coinIds = trendingCoinsRef.current.map(coin => coin.coinId);
      const priceData = await getCryptoPrices(coinIds);
      
      // Store current prices for transition effects
      const newPrevPrices: Record<string, number> = {};
      trendingCoinsRef.current.forEach(coin => {
        if (coin.currentPrice) {
          newPrevPrices[coin.coinId] = coin.currentPrice;
        }
      });
      prevPricesRef.current = newPrevPrices;
      
      // Update each coin with its latest price data
      const updatedCoins = trendingCoinsRef.current.map(coin => {
        const price = priceData[coin.coinId];
        if (price) {
          return {
            ...coin,
            currentPrice: price.usd,
            priceChangePercentage24h: price.usd_24h_change || coin.priceChangePercentage24h
          };
        }
        return coin;
      });
      
      // Update state with new data
      setTrendingCoins(updatedCoins);
      setCurrentTime(new Date());
      
      // Use a delayed update for the display coins to create a buffer
      if (bufferTimeoutRef.current) clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = setTimeout(() => {
        setDisplayCoins(updatedCoins);
        setLastFetchTime(now);
      }, 750); // 750ms buffer for smoother visual transition
      
    } catch (err) {
      console.error('Failed to update prices:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, lastFetchTime]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchTrendingCoins();
    
    // Clean up all timeouts/intervals when component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (bufferTimeoutRef.current) clearTimeout(bufferTimeoutRef.current);
    };
  }, [fetchTrendingCoins]);

  // Set up exactly 30-second refresh interval
  useEffect(() => {
    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Set new interval
    intervalRef.current = setInterval(() => {
      updatePrices();
    }, refreshInterval * 1000); // 30 seconds
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshInterval, updatePrices]);

  // Handle manual refresh with immediate update and interval reset
  const handleManualRefresh = () => {
    // Cancel current interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Immediately update prices
    updatePrices();
    
    // Reset interval timing
    intervalRef.current = setInterval(() => {
      updatePrices();
    }, refreshInterval * 1000);
  };

  // Price change animation class
  const getPriceChangeClass = (coin: Crypto) => {
    const prevPrice = prevPricesRef.current[coin.coinId];
    if (!prevPrice || !coin.currentPrice) return "";
    
    if (coin.currentPrice > prevPrice) {
      return "text-green-500 transition-colors duration-1000";
    } else if (coin.currentPrice < prevPrice) {
      return "text-red-500 transition-colors duration-1000";
    }
    return "";
  };

  return (
    <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
      {/* Left column content */}
      <div className="md:w-1/2 md:pr-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Master Your Crypto Portfolio</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Track, analyze, and optimize your cryptocurrency investments with powerful tools and real-time data.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center hover:opacity-90 transition text-white font-medium text-lg shadow-lg shadow-blue-500/20">
                Go to Dashboard
              </Link>
              <Link to="/portfolio" className="px-8 py-3 border border-blue-400 rounded-lg text-center hover:bg-blue-900/20 transition text-blue-400 font-medium text-lg">
                View Portfolio
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center hover:opacity-90 transition text-white font-medium text-lg shadow-lg shadow-blue-500/20">
                Get Started
              </Link>
              <Link to="/demo" className="px-8 py-3 border border-blue-400 rounded-lg text-center hover:bg-blue-900/20 transition text-blue-400 font-medium text-lg">
                View Demo
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Right column with crypto prices */}
      <div className="md:w-1/2 mt-12 md:mt-0">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-50"></div>
          <div className="relative bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Trending Coins</h3>
              <div className="flex items-center">
                {isRefreshing && (
                  <span className="mr-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </span>
                )}
                <span className="text-sm text-gray-400">
                  Updated: {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            {error && (
              <ErrorAlert error={error} onDismiss={() => setError(null)} />
            )}
            
            {isLoading && displayCoins.length === 0 ? (
              <div className="flex justify-center py-10">
                <div className="animate-pulse flex space-x-2 items-center">
                  <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-400 ml-2">Loading prices...</span>
                </div>
              </div>
            ) : displayCoins.length === 0 ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-400">No trending coins available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayCoins.map(coin => (
                  <div key={coin.coinId} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                        {coin.image ? (
                          <img src={coin.image} alt={coin.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span>{coin.symbol.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getPriceChangeClass(coin)}`}>
                        ${coin.currentPrice ? coin.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : 'Loading...'}
                      </p>
                      <p className={`text-sm ${coin.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.priceChangePercentage24h >= 0 ? '▲' : '▼'} {Math.abs(coin.priceChangePercentage24h || 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Bottom controls with refresh button */}
            <div className="mt-6 flex justify-end items-center space-x-2">
              <span className="text-xs text-gray-400">Auto-refreshes every 30 seconds</span>
              <button
                onClick={handleManualRefresh}
                className={`bg-blue-500 hover:bg-blue-600 text-white p-1 rounded ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isRefreshing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;