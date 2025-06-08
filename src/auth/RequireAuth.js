import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

const RequireAuth = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default RequireAuth;

