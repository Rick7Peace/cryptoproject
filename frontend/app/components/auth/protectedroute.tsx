import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { authorizationApi } from '../../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
}) => {
  const { isAuthenticated, token, user } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check for required permissions or roles when component mounts
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!isAuthenticated || !token || !user) {
        setIsAuthorized(false);
        return;
      }

      // No specific permission or role required, so user is authorized
      if (!requiredPermission && !requiredRole) {
        setIsAuthorized(true);
        return;
      }

      try {
        setIsChecking(true);
        let hasAccess = true;

        // Check permission if required
        if (requiredPermission) {
          const hasPermission = await authorizationApi.hasPermission(requiredPermission);
          hasAccess = hasAccess && hasPermission;
        }

        // Check role if required
        if (requiredRole) {
          const hasRole = await authorizationApi.hasRole(requiredRole);
          hasAccess = hasAccess && hasRole;
        }

        setIsAuthorized(hasAccess);
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [isAuthenticated, token, user, requiredPermission, requiredRole]);

  // Show loading state while checking permissions
  if (isChecking) {
    return <div>Checking permissions...</div>; // You could replace this with a loading spinner
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect if not authorized
  if (isAuthorized === false) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Only render children if explicitly authorized
  if (isAuthorized === true) {
    return <>{children}</>;
  }

  return null; // Don't render anything while we're still determining authorization
};

export default ProtectedRoute;