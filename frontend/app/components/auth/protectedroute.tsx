//frontend/app/components/auth

import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext'; // Adjust based on actual export pattern

// Import the Permission and Role types
import type { Permission, Role } from '../../api/auth';

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

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Fixed type for 'p' parameter
  if (requiredPermission) {
    const hasPermission = user?.permissions?.some((p: Permission) => p.name === requiredPermission);
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Fixed type for 'r' parameter
  if (requiredRole) {
    const hasRole = user?.roles?.some((r: Role) => r.name === requiredRole);
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;