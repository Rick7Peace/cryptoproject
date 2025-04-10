import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Sample trending coins data - would be fetched from API in production
const trendingCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '61,247.83', change: '+2.4%', color: 'text-green-500' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '3,459.22', change: '+1.8%', color: 'text-green-500' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: '139.65', change: '+5.7%', color: 'text-green-500' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '0.59', change: '-0.9%', color: 'text-red-500' },
];

const LandingHero: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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
              <span className="text-sm text-gray-400">
                Last updated: {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="space-y-4">
              {trendingCoins.map(coin => (
                <div key={coin.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 flex items-center justify-center">
                      {coin.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-sm text-gray-400">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${coin.price}</p>
                    <p className={`text-sm ${coin.color}`}>{coin.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;