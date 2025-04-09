import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [trackedCurrencies, setTrackedCurrencies] = useState<CryptoCurrency[]>([]);
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's tracked currencies on component mount
  useEffect(() => {
    const fetchTrackedCurrencies = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch this from your backend
        // For now, we'll use local storage as a mock
        const savedCurrencies = localStorage.getItem(`tracked_currencies_${user?.id}`);
        
        if (savedCurrencies) {
          setTrackedCurrencies(JSON.parse(savedCurrencies));
        }
        
        // Simulate API call to get latest prices
        await updatePrices();
        
      } catch (err) {
        setError('Failed to load your tracked cryptocurrencies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackedCurrencies();
  }, [user?.id]);

  // Function to update crypto prices (would call your API in a real app)
  const updatePrices = async () => {
    // In a real app, this would be an API call to get current prices
    // For this example, we'll just simulate it
    if (trackedCurrencies.length === 0) return;

    try {
      // Example API endpoint: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum
      const ids = trackedCurrencies.map(c => c.id).join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch updated prices');
      }
      
      const updatedCurrencies = await response.json();
      setTrackedCurrencies(updatedCurrencies);
      
      // Save to localStorage (in a real app, this would be saved to your backend)
      localStorage.setItem(`tracked_currencies_${user?.id}`, JSON.stringify(updatedCurrencies));
      
    } catch (err) {
      console.error('Error updating prices:', err);
      setError('Failed to update cryptocurrency prices');
    }
  };

  // Search for cryptocurrencies
  const searchCryptocurrencies = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      // In a real app, you would search through your backend or directly via an API
      // Example API: https://api.coingecko.com/api/v3/search?query=bitcoin
      const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      // We need to get the full coin data for the search results
      if (data.coins && data.coins.length > 0) {
        const ids = data.coins.slice(0, 5).map((coin: any) => coin.id).join(',');
        const detailsResponse = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`);
        
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch coin details');
        }
        
        const detailedCoins = await detailsResponse.json();
        setSearchResults(detailedCoins);
      } else {
        setSearchResults([]);
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for cryptocurrencies');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a cryptocurrency to track
  const addCurrencyToTrack = (currency: CryptoCurrency) => {
    const isAlreadyTracked = trackedCurrencies.some(c => c.id === currency.id);
    
    if (!isAlreadyTracked) {
      const updatedList = [...trackedCurrencies, currency];
      setTrackedCurrencies(updatedList);
      
      // Save to localStorage (in a real app, this would be saved to your backend)
      localStorage.setItem(`tracked_currencies_${user?.id}`, JSON.stringify(updatedList));
    }
    
    setIsAddingCurrency(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Remove a cryptocurrency from tracking
  const removeCurrency = (currencyId: string) => {
    const updatedList = trackedCurrencies.filter(c => c.id !== currencyId);
    setTrackedCurrencies(updatedList);
    
    // Save to localStorage (in a real app, this would be saved to your backend)
    localStorage.setItem(`tracked_currencies_${user?.id}`, JSON.stringify(updatedList));
  };

  // Render empty state when no currencies are tracked
  const renderEmptyState = () => (
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
        onClick={() => setIsAddingCurrency(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Add Cryptocurrency
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Cryptocurrency Tracker</h1>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="block text-sm font-medium text-gray-500">Welcome,</span>
              <span className="text-sm text-gray-900">{user?.name || 'User'}</span>
            </div>
            <button 
              onClick={() => updatePrices()}
              className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between">
          <h2 className="text-xl font-medium text-gray-900">Your Tracked Cryptocurrencies</h2>
          {trackedCurrencies.length > 0 && (
            <button
              onClick={() => setIsAddingCurrency(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Crypto
            </button>
          )}
        </div>

        {isLoading && trackedCurrencies.length === 0 ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : trackedCurrencies.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {trackedCurrencies.map(currency => (
                <li key={currency.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={currency.image} alt={currency.name} />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{currency.name}</p>
                          <span className="ml-1.5 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{currency.symbol.toUpperCase()}</span>
                        </div>
                        <p className="text-sm text-gray-500">Added to your watchlist</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium text-gray-900">${currency.current_price.toLocaleString()}</p>
                        <p className={`text-xs ${currency.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {currency.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(currency.price_change_percentage_24h).toFixed(2)}%
                        </p>
                      </div>
                      <button
                        onClick={() => removeCurrency(currency.id)}
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
        )}

        {/* Modal for adding cryptocurrencies */}
        {isAddingCurrency && (
          <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsAddingCurrency(false)}></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsAddingCurrency(false)}
                  >
                    <span className="sr-only">Close</span>
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
                    <div className="flex">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name (e.g. Bitcoin, Ethereum)"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <button
                        onClick={searchCryptocurrencies}
                        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Search
                      </button>
                    </div>
                    
                    {isLoading && (
                      <div className="flex justify-center py-6">
                        <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {!isLoading && searchResults.length === 0 && searchTerm && (
                      <p className="mt-4 text-sm text-gray-500">No results found for "{searchTerm}"</p>
                    )}
                    
                    {!isLoading && searchResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Search results</h4>
                        <ul className="divide-y divide-gray-200">
                          {searchResults.map((result) => (
                            <li key={result.id} className="py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <img className="h-8 w-8 rounded-full" src={result.image} alt={result.name} />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{result.name}</p>
                                    <p className="text-xs text-gray-500">{result.symbol.toUpperCase()}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => addCurrencyToTrack(result)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  Add
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;