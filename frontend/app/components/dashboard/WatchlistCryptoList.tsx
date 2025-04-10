import React, { useState, useEffect } from 'react';
import type { Crypto } from '~/types/cryptoTypes';

// Sub-components for better organization
import { WatchlistHeader } from './watchlist/WatchlistHeader';
import { CryptoItem } from './watchlist/CryptoItem';
import { EmptyState } from './watchlist/EmptyState';
import { LoadingState } from './watchlist/LoadingState';

interface WatchlistCryptoListProps {
  cryptos: Crypto[];
  onRemove: (coinId: string) => void;
  onAddCrypto: () => void;
  isLoading?: boolean;
}

const WatchlistCryptoList: React.FC<WatchlistCryptoListProps> = ({ 
  cryptos, 
  onRemove, 
  onAddCrypto,
  isLoading = false 
}) => {
  // Keep a local copy of cryptos to handle transitions and prevent disappearing
  const [localCryptos, setLocalCryptos] = useState<Crypto[]>(cryptos);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isAddingCrypto, setIsAddingCrypto] = useState(false);
  
  // Update local cryptos whenever the prop changes
  useEffect(() => {
    if (cryptos?.length) {
      // Sort the cryptos by name to maintain consistent ordering
      const sortedCryptos = [...cryptos].sort((a, b) => 
        (a.name || '').localeCompare(b.name || '')
      );
      setLocalCryptos(sortedCryptos);
    } else {
      setLocalCryptos([]);
    }
  }, [cryptos]);
  
  // Enhanced add crypto handler with error handling
  const handleAddCrypto = () => {
    if (isAddingCrypto) return; // Prevent multiple clicks
    
    setIsAddingCrypto(true);
    try {
      onAddCrypto();
    } catch (error) {
      console.error("Error adding crypto:", error);
    } finally {
      // Reset after a short delay to prevent rapid clicking
      setTimeout(() => setIsAddingCrypto(false), 1000);
    }
  };
  const handleRemove = (coinId: string) => {
    if (!coinId) return;
    
    // Add to removing set to show animation
    setRemovingIds(prev => new Set(prev).add(coinId));
    
    // Delay actual removal to allow for animation
    try {
      onRemove(coinId);
    } catch (error) {
      console.error("Error removing crypto:", error);
      // Remove from animating state if there was an error
      setRemovingIds(prev => {
        const updated = new Set(prev);
        updated.delete(coinId);
        return updated;
      });
    }
  };
  return (
    <>
      <WatchlistHeader 
        hasItems={localCryptos.length > 0}
        onAddCrypto={handleAddCrypto}
        isLoading={isLoading || isAddingCrypto}
      />

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30"></div>
        <div className="relative bg-slate-800 shadow overflow-hidden sm:rounded-lg">
          {isLoading && localCryptos.length === 0 ? (
            <LoadingState />
          ) : (
            <ul className="divide-y divide-slate-700">
              {localCryptos.map((crypto) => (
                <CryptoItem 
                  key={crypto.coinId || crypto._id}
                  crypto={crypto}
                  isRemoving={removingIds.has(crypto.coinId)}
                  onRemove={() => handleRemove(crypto.coinId)}
                />
              ))}
              
              {localCryptos.length === 0 && !isLoading && (
                <EmptyState onAddCrypto={onAddCrypto} />
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchlistCryptoList;