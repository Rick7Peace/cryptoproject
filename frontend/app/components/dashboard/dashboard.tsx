import React, { useState, useEffect } from 'react';
import { useAuth } from '~/context/AuthContext';

// Custom hooks
import { useWatchlist } from '~/hooks/useWatchlist';
import { useCryptoSearch } from '~/hooks/useCryptoSearch';

// Components
import DashboardHeader from './DashboardHeader';
import ErrorAlert from './ErrorAlert';
import EmptyWatchlistState from './EmptyWatchlistState';
import WatchlistCryptoList from './WatchlistCryptoList';
import AddCryptoModal from './AddCryptoModal';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Custom hooks for watchlist and search functionality
  const { 
    watchlistCryptos, 
    isLoading, 
    error, 
    updatePrices, 
    addCrypto, 
    removeCrypto, 
    setError 
  } = useWatchlist(token);
  
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    clearSearch
  } = useCryptoSearch();

  // Get display name from user object - use username or full name if available
  const getDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    return user.username;
  };

  // Add crypto to watchlist
  const handleAddCrypto = async (coinId: string) => {
    const success = await addCrypto(coinId);
    if (success) {
      setIsAddingCurrency(false);
      clearSearch();
      // Immediately update prices to get the latest data
      updatePrices();
    }
  };

  // Close modal and clear search
  const handleCloseModal = () => {
    setIsAddingCurrency(false);
    clearSearch();
  };

  // Set up auto-refresh interval for real-time price updates
  useEffect(() => {
    if (watchlistCryptos.length === 0) return;
    
    const interval = setInterval(() => {
      updatePrices().then(() => {
        setLastUpdated(new Date());
      });
    }, refreshInterval * 1000);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [watchlistCryptos, refreshInterval, updatePrices]);

  // Custom price refresh function that updates the timestamp
  const handleRefresh = () => {
    updatePrices().then(() => {
      setLastUpdated(new Date());
    });
  };

  // Render content based on loading state and watchlist data
  const renderContent = () => {
    // Show loading spinner when data is loading and no crypto is loaded yet
    if (isLoading && watchlistCryptos.length === 0) {
      return (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

    // Show empty state when no cryptocurrencies are in watchlist
    if (watchlistCryptos.length === 0) {
      return (
        <EmptyWatchlistState onAddCrypto={() => setIsAddingCurrency(true)} />
      );
    }

    // Show the crypto list when we have items in the watchlist
    return (
      <div>
        <WatchlistCryptoList 
          cryptos={watchlistCryptos} 
          onRemove={removeCrypto} 
          onAddCrypto={() => setIsAddingCurrency(true)} 
        />
        
        {/* Auto-refresh controls */}
        <div className="mt-6 flex justify-end items-center space-x-3">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Auto-refresh:</span>
            <select
              className="bg-white text-xs text-gray-700 rounded px-2 py-1 border border-gray-300"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
            >
              <option value="10">10s</option>
              <option value="30">30s</option>
              <option value="60">1m</option>
              <option value="300">5m</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center p-1.5 border border-transparent rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            aria-label="Refresh now"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader 
        username={getDisplayName()} 
        onRefresh={handleRefresh} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert 
          error={error || ''} 
          onDismiss={() => setError(null)} 
        />

        {renderContent()}

        <AddCryptoModal 
          isOpen={isAddingCurrency}
          onClose={handleCloseModal}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          searchResults={searchResults}
          isSearching={isSearching}
          onAddCrypto={handleAddCrypto}
        />
      </main>
    </div>
  );
};

export default Dashboard;