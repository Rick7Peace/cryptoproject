import React from 'react';
import type { Crypto } from '~/types/cryptoTypes';

interface WatchlistCryptoListProps {
  cryptos: Crypto[];
  onRemove: (coinId: string) => void;
  onAddCrypto: () => void;
}

const WatchlistCryptoList: React.FC<WatchlistCryptoListProps> = ({ cryptos, onRemove, onAddCrypto }) => {
  return (
    <>
      <div className="mb-6 flex justify-between">
        <h2 className="text-xl font-medium text-gray-900">Your Tracked Cryptocurrencies</h2>
        {cryptos.length > 0 && (
          <button
            onClick={onAddCrypto}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Crypto
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {cryptos.map((crypto) => (
            <li key={crypto._id}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  {crypto.image && <img className="h-10 w-10 rounded-full" src={crypto.image} alt={crypto.name} />}
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{crypto.name}</p>
                      <span className="ml-1.5 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{crypto.symbol.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-gray-500">Added to your watchlist</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium text-gray-900">
                      ${crypto.currentPrice ? crypto.currentPrice.toLocaleString() : 'N/A'}
                    </p>
                    <p className={`text-xs ${crypto.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.priceChangePercentage24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(crypto.coinId)}
                    className="ml-2 bg-white rounded-full p-1 text-gray-400 hover:text-red-500"
                  >
                    <span className="sr-only">Remove</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default WatchlistCryptoList;