import React, { useState } from 'react';
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
    }
  };

  // Close modal and clear search
  const handleCloseModal = () => {
    setIsAddingCurrency(false);
    clearSearch();
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
      <WatchlistCryptoList 
        cryptos={watchlistCryptos} 
        onRemove={removeCrypto} 
        onAddCrypto={() => setIsAddingCurrency(true)} 
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader 
        username={getDisplayName()} 
        onRefresh={updatePrices} 
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