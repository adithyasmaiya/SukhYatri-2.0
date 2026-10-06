import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingState } from '../ui/LoadingState';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1A17]">
        <LoadingState message="Verifying administrative credentials…" />
      </div>
    );
  }

  // 1. Not authenticated -> Redirect to /login with redirect query param
  if (!isAuthenticated || !currentUser) {
    const encodedTarget = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${encodedTarget}`} replace />;
  }

  // 2. Authenticated but not admin -> Authorization Error (403 Forbidden)
  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0B1A17] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-clay/20 text-clay border border-clay/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight mb-2">
            Access Restricted
          </h1>
          <p className="text-sm text-sand/70 mb-6 leading-relaxed">
            You are signed in as <span className="text-white font-semibold">{currentUser.email}</span>, which does not have administrator privileges for the SukhYatri Operations Console.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-sand text-ink rounded-xl font-bold text-sm hover:bg-sand/90 transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
