import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from '../ui/LoadingState';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerified?: boolean;
  requiredRole?: 'admin' | 'customer' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerified = false,
  requiredRole,
}) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Checking security credentials…" />;
  }

  const currentPathWithQuery = location.pathname + location.search;

  // 1. Unauthenticated users -> Redirect to /login with redirect return param
  if (!isAuthenticated || !currentUser) {
    const encodedTarget = encodeURIComponent(currentPathWithQuery);
    return <Navigate to={`/login?redirect=${encodedTarget}`} replace />;
  }

  // 2. Email verification requirement check
  if (requireEmailVerified && !currentUser.emailVerified) {
    const encodedTarget = encodeURIComponent(currentPathWithQuery);
    return <Navigate to={`/verify-email?redirect=${encodedTarget}`} replace />;
  }

  // 3. Role authorization check
  if (requiredRole === 'admin' && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
