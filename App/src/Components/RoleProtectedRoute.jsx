import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // Decoding the JWT manually using atob
  let userRole = null;
  try {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64)); 
    userRole = decoded.role; 
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/register" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
