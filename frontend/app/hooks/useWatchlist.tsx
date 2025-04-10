import { useState, useEffect } from 'react';
import type { Crypto } from '~/types/cryptoTypes';
import { 
  getUserWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from '~/services/watchlistService';
import { getCryptoPrices } from '~/services/cryptoService';

export function useWatchlist(token: string | null) {
  const [watchlistCryptos, setWatchlistCryptos] = useState<Crypto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const watchlist = await getUserWatchlist(token);
      setWatchlistCryptos(watchlist);
      setError(null);
    } catch (err) {
      setError('Failed to load your watchlist');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cryptocurrency prices
  const updatePrices = async () => {
    if (watchlistCryptos.length === 0) return;

    try {
      const coinIds = watchlistCryptos.map(crypto => crypto.coinId).join(',');
      const prices = await getCryptoPrices(coinIds.split(','));
      
      const updatedCryptos = watchlistCryptos.map(crypto => {
        const priceData = prices[crypto.coinId];
        if (priceData) {
          return {
            ...crypto,
            currentPrice: priceData.usd,
            priceChangePercentage24h: priceData.usd_24h_change || 0
          };
        }
        return crypto;
      });
      
      setWatchlistCryptos(updatedCryptos);
    } catch (err) {
      console.error('Error updating prices:', err);
      setError('Failed to update cryptocurrency prices');
    }
  };

  // Add a cryptocurrency to watchlist
  const addCrypto = async (coinId: string) => {
    if (!token) return;

    try {
      const updatedWatchlist = await addToWatchlist(token, coinId);
      setWatchlistCryptos(updatedWatchlist);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      setError('Failed to add cryptocurrency to your watchlist');
      return false;
    }
  };

  // Remove a cryptocurrency from watchlist
  const removeCrypto = async (coinId: string) => {
    if (!token) return;

    try {
      const updatedWatchlist = await removeFromWatchlist(token, coinId);
      setWatchlistCryptos(updatedWatchlist);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove cryptocurrency from your watchlist');
      return false;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchWatchlist();
  }, [token]);

  return {
    watchlistCryptos,
    isLoading,
    error,
    updatePrices,
    addCrypto,
    removeCrypto,
    setError,
  };
}