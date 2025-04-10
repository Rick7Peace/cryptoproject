import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchTermChange, 
  onSearch 
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search by name (e.g. Bitcoin, Ethereum)"
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 rounded-md text-gray-100 placeholder-gray-400"
      />
      <button
        onClick={onSearch}
        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;