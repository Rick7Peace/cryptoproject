import { Link, useNavigate } from 'react-router'; // Fixed import and added useNavigate
import React, { useState } from 'react';
import { useAuth } from '~/context/AuthContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          CryptoTrack
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8 items-center">
        <Link to="#features" className="hover:text-blue-400 transition">Features</Link>
        <Link to="#pricing" className="hover:text-blue-400 transition">Pricing</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/portfolio" className="hover:text-blue-400 transition">Portfolio</Link>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoggingOut ? 'Logging Out...' : 'Log Out'}
            </button>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/portfolio" className="hover:text-blue-400 transition">Portfolio</Link>
            <Link to="/login" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition text-white">Sign Up</Link>
          </>
        )}
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 right-0 left-0 bg-slate-900 z-50 p-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link to="#features" className="hover:text-blue-400 transition">Features</Link>
            <Link to="#pricing" className="hover:text-blue-400 transition">Pricing</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                <Link to="/portfolio" className="hover:text-blue-400 transition">Portfolio</Link>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition text-center ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                </button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                <Link to="/portfolio" className="hover:text-blue-400 transition">Portfolio</Link>
                <Link to="/login" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition text-center">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition text-white text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;