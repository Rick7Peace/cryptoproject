import React from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import type { Crypto } from '~/types/cryptoTypes';

interface AddCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  searchResults: Crypto[];
  isSearching: boolean;
  onAddCrypto: (coinId: string) => void;
}

const AddCryptoModal: React.FC<AddCryptoModalProps> = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchTermChange,
  onSearch,
  searchResults,
  isSearching,
  onAddCrypto
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              Add a cryptocurrency to track
            </h3>
            <div className="mt-2">
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchTermChange={onSearchTermChange} 
                onSearch={onSearch} 
              />
              
              <SearchResults 
                results={searchResults} 
                isLoading={isSearching} 
                searchTerm={searchTerm} 
                onAddCrypto={onAddCrypto} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCryptoModal;