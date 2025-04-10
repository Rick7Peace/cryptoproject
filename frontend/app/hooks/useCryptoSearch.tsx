import { useState } from 'react';
import type { Crypto } from '~/types/cryptoTypes';
import { searchCryptos } from '~/services/cryptoService';

export function useCryptoSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Crypto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchError(null);
      const results = await searchCryptos(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Failed to search for cryptocurrencies');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    handleSearch,
    clearSearch
  };
}