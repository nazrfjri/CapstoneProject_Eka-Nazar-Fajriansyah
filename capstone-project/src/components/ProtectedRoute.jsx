import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  if (!token) {
    localStorage.setItem('lastPath', location.pathname);
    return <Navigate to="/login" />;
  }

  const lastPath = localStorage.getItem('lastPath');
  if (lastPath) {
    navigate(lastPath);
    localStorage.removeItem('lastPath');
  }

  return children;
};

export default ProtectedRoute;
