import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { AUTH_CONFIG } from "../config/constants";

const ProtectedRoute = ({ children, requireStaff = false }) => {
  const { isAuthorized, user, isStaff, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthorized) {
    return <Navigate to="/signin" />;
  }

  // Check if staff access is required
  if (requireStaff && !isStaff) {
    return <Navigate to="/" />; // Redirect to home if not staff
  }

  return children;
};

export default ProtectedRoute;
