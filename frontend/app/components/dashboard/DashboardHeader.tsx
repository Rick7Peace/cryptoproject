import React from 'react';
import { Link } from 'react-router';

interface DashboardHeaderProps {
  username: string;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username, onRefresh }) => {
  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
        <Link to="/" className="hover:opacity-80 transition">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CryptoTracker
            </span>
          </Link>
        </h1>
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <span className="block text-sm font-medium text-gray-400">Welcome,</span>
            <span className="text-sm text-gray-100">{username || 'User'}</span>
          </div>
          <button 
            onClick={onRefresh}
            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition"
            aria-label="Refresh prices"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;