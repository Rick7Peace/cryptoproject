import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="error-page">
      <div className="error-container">
        <h1 className="error-title">Access Denied</h1>
        <p className="error-message">
          You don't have permission to access this resource.
        </p>
        <div className="error-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;