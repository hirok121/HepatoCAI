import React, { useState, useEffect } from "react";

const AuthDebugPanel = () => {
  const [authData, setAuthData] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const user = localStorage.getItem("user");

      let isAuthenticated = false;
      let decodedToken = null;

      if (token) {
        try {
          decodedToken = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;
          isAuthenticated = decodedToken.exp > currentTime;
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      setAuthData({
        token,
        refreshToken,
        user: user ? JSON.parse(user) : null,
        decodedToken,
        isAuthenticated,
      });
    };

    checkAuth();

    // Check every 5 seconds
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setAuthData({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="text-lg font-bold mb-2">Auth Debug Panel</h3>

      <div className="text-sm space-y-2">
        <div>
          <strong>Status:</strong>{" "}
          <span
            className={
              authData.isAuthenticated ? "text-green-400" : "text-red-400"
            }
          >
            {authData.isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </span>
        </div>

        {authData.token && (
          <div>
            <strong>Token:</strong>{" "}
            <span className="font-mono text-xs">
              {authData.token.substring(0, 20)}...
            </span>
          </div>
        )}

        {authData.decodedToken && (
          <div>
            <strong>Expires:</strong>{" "}
            {new Date(authData.decodedToken.exp * 1000).toLocaleString()}
          </div>
        )}

        {authData.user && (
          <div>
            <strong>User:</strong> {authData.user.email || "Unknown"}
          </div>
        )}

        <button
          onClick={clearAuth}
          className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          Clear Auth Data
        </button>
      </div>
    </div>
  );
};

export default AuthDebugPanel;
