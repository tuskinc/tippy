import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RequireAuth is a wrapper that checks if the user is logged in.
 * If not, it redirects to the login page. If yes, it renders its children.
 * This helps protect routes so only logged-in users can access them.
 */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking auth state, show nothing (or a spinner if you want)
  if (loading) return null;

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the children (the protected page)
  return <>{children}</>;
};

export default RequireAuth; 