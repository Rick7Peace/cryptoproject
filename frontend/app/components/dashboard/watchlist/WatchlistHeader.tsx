import React from 'react';

interface WatchlistHeaderProps {
  hasItems: boolean;
  onAddCrypto: () => void;
  isLoading: boolean;
}

export const WatchlistHeader: React.FC<WatchlistHeaderProps> = ({ 
  hasItems, 
  onAddCrypto, 
  isLoading 
}) => {
  return (
    <div className="mb-6 flex justify-between">
      <h2 className="text-xl font-medium text-gray-100">Your Tracked Cryptocurrencies</h2>
      {hasItems && (
        <button
          onClick={onAddCrypto}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 mr-1.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
          Add Crypto
        </button>
      )}
    </div>
  );
};