import { useState } from 'react';
import type { Crypto } from '~/types/cryptoTypes';
import apiClient from '~/api/apiClient';

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
      
      // This API call connects to your backend, which queries the database
      const response = await apiClient.get('/crypto/search', {
        params: { query: searchTerm }
      });
      
      if (response.data.success) {
        setSearchResults(response.data.data);
      } else {
        throw new Error(response.data.message || 'Search failed');
      }
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