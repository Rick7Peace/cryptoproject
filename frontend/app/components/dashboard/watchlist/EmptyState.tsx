import React from 'react';

interface EmptyStateProps {
  onAddCrypto: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddCrypto }) => {
  return (
    <div className="px-4 py-8 text-center text-gray-400">
      <p>No cryptocurrencies in your watchlist yet</p>
      <button
        onClick={onAddCrypto}
        className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Your First Crypto
      </button>
    </div>
  );
};