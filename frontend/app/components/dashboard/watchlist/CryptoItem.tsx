import React from 'react';
import type { Crypto } from '~/types/cryptoTypes';
import styles from '~/styles/CryptoItem.module.css';

export interface CryptoItemProps {
  crypto: Crypto;
  isRemoving: boolean;
  isNew: boolean;
  onRemove: () => void;
  className?: string;
}

export const CryptoItem: React.FC<CryptoItemProps> = ({
  crypto,
  isRemoving,
  isNew,
  onRemove
}) => {
  // Calculate price change class
  const getPriceChangeClass = (): string => {
    if (crypto.priceChangePercentage24h > 0) {
      return styles.positive;
    }
    if (crypto.priceChangePercentage24h < 0) {
      return styles.negative;
    }
    return '';
  };
  
  // Dynamic class names based on component state
  const itemClassName = `${styles.item} ${
    isNew ? styles.newItem : ''
  } ${
    isRemoving ? styles.removing : ''
  }`.trim();

  return (
    <div className={itemClassName}>
      <div className={styles.infoSection}>
        <div className={styles.iconContainer}>
          {crypto.image ? (
            <img src={crypto.image} alt={crypto.symbol} />
          ) : (
            <span>{crypto.symbol?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className={styles.cryptoDetails}>
          <span className={styles.name}>{crypto.name}</span>
          <span className={styles.symbol}>{crypto.symbol}</span>
        </div>
      </div>
      
      <div className={styles.priceSection}>
        <p className={styles.price}>
          ${crypto.currentPrice?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <p className={`${styles.priceChange} ${getPriceChangeClass()}`}>
          {crypto.priceChangePercentage24h >= 0 ? '▲' : '▼'} 
          {Math.abs(crypto.priceChangePercentage24h || 0).toFixed(2)}%
        </p>
      </div>
      
      <button 
        onClick={onRemove} 
        className={styles.removeButton}
        aria-label="Remove crypto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};