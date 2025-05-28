// File: frontend/src/components/ProtectedRoute.jsx
// Description: This component checks if the user is authenticated using AuthContext.

import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthorized } = useAuth();

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/signin" />;
}

export default ProtectedRoute;
