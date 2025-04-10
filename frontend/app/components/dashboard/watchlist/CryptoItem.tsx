import React from 'react';
import type { Crypto } from '~/types/cryptoTypes';

interface CryptoItemProps {
  crypto: Crypto;
  isRemoving: boolean;
  isNew?: boolean;
  onRemove: () => void;
}

export const CryptoItem: React.FC<CryptoItemProps> = ({ 
  crypto, 
  isRemoving,
  isNew = false, 
  onRemove 
}) => {
  // Helper functions moved to this component
  const getPriceChangeClassName = (priceChange: number | undefined): string => {
    if (typeof priceChange !== 'number') {
      return 'text-gray-400';
    }
    return priceChange >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getPriceChangeText = (priceChange: number | undefined): string => {
    if (typeof priceChange !== 'number') {
      return 'No data';
    }
    const direction = priceChange >= 0 ? '▲' : '▼';
    return `${direction} ${Math.abs(priceChange).toFixed(2)}%`;
  };

  const getRemoveButtonClassName = (isRemoving: boolean): string => {
    const baseClasses = 'ml-2 bg-transparent rounded-full p-1 transition';
    return isRemoving
      ? `${baseClasses} text-gray-500 cursor-not-allowed`
      : `${baseClasses} text-gray-400 hover:text-red-400 hover:bg-red-500/10`;
  };
  
  return (
    <div className={`transition-all duration-300 ${isRemoving ? 'opacity-50 scale-95' : 'opacity-100'} ${isNew ? 'animate-pulse-once bg-blue-500/10' : ''}`}>
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-slate-700/50 transition relative">
        {isNew && (
          <div className="absolute top-0 right-0 -mt-1 -mr-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500 text-white">New</span>
          </div>
        )}
        <div className="flex items-center">
          {crypto.image ? (
            <img 
              className="h-10 w-10 rounded-full" 
              src={crypto.image} 
              alt={crypto.name} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=' + crypto.symbol.charAt(0).toUpperCase();
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-gray-300">
              {crypto.symbol?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div className="ml-4">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-100">{crypto.name || 'Unknown'}</p>
              <span className="ml-1.5 text-xs bg-slate-700 px-2 py-0.5 rounded text-gray-300">
                {(crypto.symbol || '?').toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400">Added to your watchlist</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <p className="text-sm font-medium text-gray-100">
              ${crypto.currentPrice ? crypto.currentPrice.toLocaleString() : 'N/A'}
            </p>
            <p className={`text-xs ${getPriceChangeClassName(crypto.priceChangePercentage24h)}`}>
              {getPriceChangeText(crypto.priceChangePercentage24h)}
            </p>
          </div>
          <button
            onClick={onRemove}
            disabled={isRemoving}
            className={getRemoveButtonClassName(isRemoving)}
          >
            <span className="sr-only">Remove</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};