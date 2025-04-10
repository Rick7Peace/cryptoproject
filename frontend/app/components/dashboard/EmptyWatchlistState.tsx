import React from 'react';

interface EmptyWatchlistStateProps {
  onAddCrypto: () => void;
}

const EmptyWatchlistState: React.FC<EmptyWatchlistStateProps> = ({ onAddCrypto }) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">No cryptocurrencies tracked yet</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        You're not tracking any cryptocurrencies. Add your first one to start monitoring its value.
      </p>
      <button
        onClick={onAddCrypto}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Add Cryptocurrency
      </button>
    </div>
  );
};

export default EmptyWatchlistState;