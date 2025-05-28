import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// Create AuthContext
const AuthContext = createContext({
  isAuthorized: false,
  user: null,
  login: async (credentials) => {},
  logout: () => {},
});

// Helper to safely decode JWT
const safeDecode = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  // Validate token and update auth state
  const checkAuth = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const decoded = safeDecode(token);

    if (decoded) {
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        setIsAuthorized(true);
        setUser(decoded);
        return true;
      }
    }

    logout();
    return false;
  };

  // Refresh access token using refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) {
      logout();
      return false;
    }

    try {
      const res = await api.post("/accounts/token/refresh/", { refresh });
      if (res.status === 200) {
        const { access } = res.data;
        const decoded = safeDecode(access);
        if (decoded) {
          localStorage.setItem(ACCESS_TOKEN, access);
          setIsAuthorized(true);
          setUser(decoded);
          return true;
        }
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }

    logout();
    return false;
  };

  // Login method
  const login = async (credentials) => {
    try {
      const res = await api.post("/accounts/token/", credentials);
      const { access, refresh } = res.data;

      localStorage.setItem(ACCESS_TOKEN, access);
      if (refresh) localStorage.setItem(REFRESH_TOKEN, refresh);

      const decoded = safeDecode(access);
      if (decoded) {
        setIsAuthorized(true);
        setUser(decoded);
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
    }

    return false;
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthorized(false);
    setUser(null);
  };

  // On mount, check auth and set up interval refresh
  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const decoded = safeDecode(token);

      if (decoded) {
        const now = Date.now() / 1000;
        if (decoded.exp - now < 60) {
          refreshToken();
        }
      }
    }, 60 * 1000); // check every 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        user,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
