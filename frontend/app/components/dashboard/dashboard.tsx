import React, { useState, useEffect, useCallback } from 'react';
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

// Import styles (note the lowercase 'd' in dashboard.module.css)
import styles from '~/styles/dashboard.module.css';

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
    clearSearch,
  } = useCryptoSearch();

  // Get display name from user object
  const getDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    return user.username;
  };

  // Memoize the add crypto handler to prevent recreating on each render
  const handleAddCrypto = useCallback(async (coinId: string) => {
    try {
      const success = await addCrypto(coinId);
      if (success) {
        setIsAddingCurrency(false);
        clearSearch();
        // Immediately update prices to get the latest data
        updatePrices();
      }
    } catch (error) {
      console.error("Failed to add crypto:", error);
      setError("Failed to add cryptocurrency. Please try again.");
    }
  }, [addCrypto, clearSearch, updatePrices, setError]);

  // Close modal and clear search - memoized to preserve reference
  const handleCloseModal = useCallback(() => {
    setIsAddingCurrency(false);
    clearSearch();
  }, [clearSearch]);

  // Handle opening the modal - memoized to preserve reference
  const handleOpenModal = useCallback(() => {
    setIsAddingCurrency(true);
    // Reset any previous search results
    clearSearch();
  }, [clearSearch]);

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
  const handleRefresh = useCallback(() => {
    updatePrices().then(() => {
      setLastUpdated(new Date());
    });
  }, [updatePrices]);

  // Render content based on loading state and watchlist data
  const renderContent = () => {
    // Show loading spinner when data is loading and no crypto is loaded yet
    if (isLoading && watchlistCryptos.length === 0) {
      return (
        <div className={styles.loadingContainer}>
          <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

    // Show empty state when no cryptocurrencies are in watchlist
    if (watchlistCryptos.length === 0) {
      return (
        <EmptyWatchlistState onAddCrypto={handleOpenModal} />
      );
    }

    // Show the crypto list when we have items in the watchlist
    return (
      <div className={styles.cardGlow}>
        <div className={styles.card}>
          <WatchlistCryptoList 
            cryptos={watchlistCryptos} 
            onRemove={removeCrypto} 
            onAddCrypto={handleOpenModal} 
            isLoading={isLoading}
          />
          
          {/* Auto-refresh controls */}
          <div className={styles.refreshControls}>
            <span className={styles.lastUpdatedTime}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <div className={styles.refreshControlsGroup}>
              <span className={styles.refreshLabel}>Auto-refresh:</span>
              <select
                className={styles.refreshSelect}
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
              className={styles.refreshButton}
              aria-label="Refresh now"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader 
        username={getDisplayName()} 
        onRefresh={handleRefresh} 
      />

      <main className={styles.mainContent}>
        {error && (
          <ErrorAlert 
            error={error} 
            onDismiss={() => setError(null)} 
          />
        )}

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