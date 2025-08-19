import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ALLOWED_ADMIN_EMAILS = [
  'admin@gmail.com', // <-- put your admin email(s) here
];

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null;

  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;

  const isAdmin = ALLOWED_ADMIN_EMAILS.includes(user.email);
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default RequireAdmin;
