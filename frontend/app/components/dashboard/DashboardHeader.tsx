import React from 'react';
import { Link } from 'react-router';
import styles from '~/styles/dashboardHeader.module.css';

interface DashboardHeaderProps {
  username: string;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username, onRefresh }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <span className={styles.logoText}>
              CryptoTracker
            </span>
          </Link>
        </h1>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.welcomeText}>Welcome,</span>
            <span className={styles.username}>{username || 'User'}</span>
          </div>
          <button 
            onClick={onRefresh}
            className={styles.refreshButton}
            aria-label="Refresh prices"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.refreshIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;