import React from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import type { Crypto } from '~/types/cryptoTypes';
import styles from '~/styles/addCryptoModal.module.css';

interface AddCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  searchResults: Crypto[];
  isSearching: boolean;
  onAddCrypto: (coinId: string) => void;
}

const AddCryptoModal: React.FC<AddCryptoModalProps> = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchTermChange,
  onSearch,
  searchResults,
  isSearching,
  onAddCrypto
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className={styles.modalContainer}>
        <div className={styles.modalBackdrop} aria-hidden="true" onClick={onClose}></div>

        <span className={styles.modalAlignmentHelper} aria-hidden="true">&#8203;</span>
        <div className={styles.modalContent}>
          <div className={styles.gradientGlow}></div>
          <div className={styles.modalBody}>
            <div className={styles.closeButtonContainer}>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close"
              >
                <svg className={styles.closeIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className={styles.modalTitle} id="modal-title">
                Add a cryptocurrency to track
              </h3>
              <div className={styles.modalContent}>
                <SearchBar 
                  searchTerm={searchTerm} 
                  onSearchTermChange={onSearchTermChange} 
                  onSearch={onSearch} 
                />
                
                <SearchResults 
                  results={searchResults} 
                  isLoading={isSearching} 
                  searchTerm={searchTerm} 
                  onAddCrypto={onAddCrypto} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCryptoModal;