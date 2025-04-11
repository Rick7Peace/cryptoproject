import React from 'react';

interface EmptyWatchlistStateProps {
  onAddCrypto: () => void;
}

const EmptyWatchlistState: React.FC<EmptyWatchlistStateProps> = ({ onAddCrypto }) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-100 mb-2">No cryptocurrencies tracked yet</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        You're not tracking any cryptocurrencies. Add your first one to start monitoring its value.
      </p>
      <button
        onClick={onAddCrypto}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition"
      >
        Add Cryptocurrency
      </button>
    </div>
  );
};

export default EmptyWatchlistState;