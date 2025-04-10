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
  const [newlyAddedIds, setNewlyAddedIds] = useState<Set<string>>(new Set());
  const [isAddingCrypto, setIsAddingCrypto] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-render
  
  // Update local cryptos whenever the prop changes
  useEffect(() => {
    if (cryptos?.length) {
      // Find any new cryptos that weren't in our previous state
      const newIds = new Set<string>();
      cryptos.forEach(crypto => {
        const id = crypto.coinId || crypto._id;
        if (id && !localCryptos.some(c => (c.coinId || c._id) === id)) {
          newIds.add(id);
        }
      });
      
      // Update the newly added IDs
      if (newIds.size > 0) {
        setNewlyAddedIds(newIds);
        
        // Sort and update the cryptos first
        const sortedCryptos = [...cryptos].sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
        );
        setLocalCryptos(sortedCryptos);
        
        // Force re-render after a short delay to make the animation more noticeable
        setTimeout(() => {
          setForceUpdate(prev => prev + 1);
        }, 500);
        
        // Clear the "new" status after animation completes
        setTimeout(() => setNewlyAddedIds(new Set()), 2000);
      } else {
        // Sort the cryptos by name to maintain consistent ordering
        const sortedCryptos = [...cryptos].sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
        );
        setLocalCryptos(sortedCryptos);
      }
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

      <div className="relative" key={`watchlist-${forceUpdate}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30"></div>
        <div className="relative bg-slate-800 shadow overflow-hidden sm:rounded-lg p-4">
          {isLoading && localCryptos.length === 0 ? (
            <LoadingState />
          ) : (
            <>
              {localCryptos.length === 0 && !isLoading ? (
                <EmptyState onAddCrypto={onAddCrypto} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localCryptos.map((crypto) => {
                    const id = crypto.coinId || crypto._id || '';
                    const isNew = newlyAddedIds.has(id);
                    return (
                      <CryptoItem 
                        key={`${id}-${isNew ? "new" : "existing"}`}
                        crypto={crypto}
                        isRemoving={removingIds.has(crypto.coinId)}
                        isNew={isNew}
                        onRemove={() => handleRemove(crypto.coinId)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default WatchlistCryptoList;