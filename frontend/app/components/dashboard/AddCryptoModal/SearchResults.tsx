import React from 'react';
import type { Crypto } from '~/types/cryptoTypes';

interface SearchResultsProps {
  results: Crypto[];
  isLoading: boolean;
  searchTerm: string;
  onAddCrypto: (coinId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  searchTerm,
  onAddCrypto 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (results.length === 0 && searchTerm) {
    return <p className="mt-4 text-sm text-gray-500">No results found for "{searchTerm}"</p>;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Search results</h4>
      <ul className="divide-y divide-gray-200">
        {results.map((result) => (
          <li key={result._id || result.coinId} className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {result.image && <img className="h-8 w-8 rounded-full" src={result.image} alt={result.name} />}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{result.name}</p>
                  <p className="text-xs text-gray-500">{result.symbol.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => onAddCrypto(result.coinId)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;