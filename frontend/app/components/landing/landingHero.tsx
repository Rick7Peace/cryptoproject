import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getTopCryptos, getCryptoPrices } from '~/services/cryptoService';
import type { Crypto } from '~/types/cryptoTypes';

// Price transition duration in ms (longer = smoother but less responsive)
const TRANSITION_DURATION = 1200;
const BUFFER_DELAY = 500;

const LandingHero: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trendingCoins, setTrendingCoins] = useState<Crypto[]>([]);
  const [displayCoins, setDisplayCoins] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  
  // Track which coins are currently transitioning
  const [transitioningCoins, setTransitioningCoins] = useState<Set<string>>(new Set());
  // Store previous prices for smoother transitions
  const previousPricesRef = useRef<Record<string, number>>({});

  // Fetch initial trending coins
  const fetchTrendingCoins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getTopCryptos(4); // Get top 4 trending coins
      setTrendingCoins(response);
      setDisplayCoins(response);
      
      await updatePrices(response);
    } catch (err) {
      console.error('Failed to fetch trending coins:', err);
      setError('Could not load cryptocurrency data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update cryptocurrency prices in real-time
  const updatePrices = useCallback(async (coins = trendingCoins) => {
    if (coins.length === 0) return;
    
    setIsRefreshing(true);
    try {
      const coinIds = coins.map(coin => coin.coinId);
      const priceData = await getCryptoPrices(coinIds);
      
      // Save current prices before updating
      const newPreviousPrices = { ...previousPricesRef.current };
      
      // Update each coin with its latest price data
      const updatedCoins = coins.map(coin => {
        const price = priceData[coin.coinId];
        if (price) {
          if (coin.currentPrice) {
            newPreviousPrices[coin.coinId] = coin.currentPrice;
          }
          
          return {
            ...coin,
            currentPrice: price.usd,
            priceChangePercentage24h: price.usd_24h_change || coin.priceChangePercentage24h
          };
        }
        return coin;
      });
      
      // Update refs and state
      previousPricesRef.current = newPreviousPrices;
      setTrendingCoins(updatedCoins);
      setCurrentTime(new Date());
    } catch (err) {
      console.error('Failed to update prices:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [trendingCoins]);

  // Initial data load
  useEffect(() => {
    fetchTrendingCoins();
  }, [fetchTrendingCoins]);

  // Auto-refresh setup
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [refreshInterval, updatePrices]);

  // Handle price display updates with buffer
  useEffect(() => {
    if (trendingCoins.length === 0) return;
    
    // Create a new set of transitioning coins
    const newTransitioning = new Set<string>();
    
    // For each coin, apply transition if price changed
    trendingCoins.forEach(coin => {
      const prevPrice = previousPricesRef.current[coin.coinId];
      
      if (prevPrice !== undefined && coin.currentPrice !== prevPrice) {
        newTransitioning.add(coin.coinId);
      }
    });
    
    // Update transitioning state
    setTransitioningCoins(newTransitioning);
    
    // Use setTimeout to create a buffer before updating displayed coins
    const timer = setTimeout(() => {
      setDisplayCoins([...trendingCoins]);
      
      // Clear transitions after animation completes
      const clearTimer = setTimeout(() => {
        setTransitioningCoins(new Set());
      }, TRANSITION_DURATION);
      
      return () => clearTimeout(clearTimer);
    }, BUFFER_DELAY);
    
    return () => clearTimeout(timer);
  }, [trendingCoins]);

  // Get class for price change animation
  const getPriceChangeClass = (coin: Crypto) => {
    if (!transitioningCoins.has(coin.coinId)) return "";
    
    const prevPrice = previousPricesRef.current[coin.coinId];
    if (!prevPrice || !coin.currentPrice) return "";
    
    if (coin.currentPrice > prevPrice) {
      return "price-increase";
    } else if (coin.currentPrice < prevPrice) {
      return "price-decrease";
    }
    return "";
  };

  // Manual refresh handler
  const handleManualRefresh = () => {
    updatePrices();
  };

  return (
    <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 md:pr-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Master Your Crypto Portfolio</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Track, analyze, and optimize your cryptocurrency investments with powerful tools and real-time data.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center hover:opacity-90 transition text-white font-medium text-lg shadow-lg shadow-blue-500/20">
            Get Started
          </Link>
          <Link to="/demo" className="px-8 py-3 border border-blue-400 rounded-lg text-center hover:bg-blue-900/20 transition text-blue-400 font-medium text-lg">
            View Demo
          </Link>
        </div>
      </div>
      <div className="md:w-1/2 mt-12 md:mt-0">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-50"></div>
          <div className="relative bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Trending Coins</h3>
              <div className="flex items-center">
                {isRefreshing && !isLoading && (
                  <span className="mr-2">
                    <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </span>
                )}
                <span className="text-sm text-gray-400">
                  Last updated: {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-md mb-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            {isLoading && displayCoins.length === 0 ? (
              <div className="flex justify-center py-10">
                <div className="animate-pulse flex space-x-2 items-center">
                  <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-400 rounded-full animation-delay-200"></div>
                  <div className="h-3 w-3 bg-blue-400 rounded-full animation-delay-500"></div>
                  <span className="text-sm text-gray-400 ml-2">Loading prices...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayCoins.map((coin, index) => (
                  <div key={coin.coinId} 
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                    style={{ transitionDelay: `${index * 100}ms` }} // Staggered transitions
                  >
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
                      <p className={`font-medium transition-all duration-1200 ${getPriceChangeClass(coin)}`}>
                        ${coin.currentPrice ? coin.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : 'Loading...'}
                      </p>
                      <p className={`text-sm ${coin.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.priceChangePercentage24h >= 0 ? '▲' : '▼'} {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Refresh rate controls */}
            <div className="mt-6 flex justify-end items-center space-x-2">
              <span className="text-xs text-gray-400">Refresh rate:</span>
              <select
                className="bg-slate-700 text-xs text-gray-200 rounded px-2 py-1 border border-gray-600"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                disabled={isLoading}
              >
                <option value="10">10s</option>
                <option value="30">30s</option>
                <option value="60">1m</option>
                <option value="300">5m</option>
              </select>
              <button
                onClick={handleManualRefresh}
                className={`bg-blue-500 hover:bg-blue-600 text-white p-1 rounded ${(isRefreshing || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Refresh now"
                disabled={isRefreshing || isLoading}
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