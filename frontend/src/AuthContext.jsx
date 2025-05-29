import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import api from "./api"; // Assuming 'api' is your configured Axios or fetch instance
import { AUTH_CONFIG } from "./config/constants";

// Create AuthContext with default values
const AuthContext = createContext({
  isAuthorized: false,
  user: null,
  isStaff: false,
  loading: false,
  login: async () => ({
    success: false,
    error: "Provider not available",
  }),
  logout: () => {},
  refreshToken: async () => ({
    success: false,
    error: "Provider not available",
  }),
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
  const [isStaff, setIsStaff] = useState(false); // Added isStaff state
  const [loading, setLoading] = useState(true); // Start as true during initial check
  // Logout method (using useCallback for stability)
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    setIsAuthorized(false);
    setUser(null);
    setIsStaff(false); // Reset isStaff on logout
  }, []);
  // Refresh access token using refresh token
  const refreshToken = useCallback(async () => {
    setLoading(true);
    const refresh = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    if (!refresh) {
      logout();
      setLoading(false);
      return { success: false, error: "No refresh token available." };
    }

    try {
      const res = await api.post("/accounts/token/refresh/", { refresh });
      if (res.status === 200) {
        const { access } = res.data;
        const decoded = safeDecode(access);
        if (decoded) {
          localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, access);
          setIsAuthorized(true);
          setUser(decoded);
          setIsStaff(decoded.is_staff || false); // Set isStaff from token
          setLoading(false);
          return { success: true, user: decoded };
        }
      }
      // If status is not 200 or decoding fails
      throw new Error("Failed to refresh or decode token.");
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
      setLoading(false);
      return {
        success: false,
        error: error.message || "Session expired. Please log in again.",
      };
    }
  }, [logout]); // Added logout to dependency array
  // Validate token and update auth state (using useCallback)
  const checkAuth = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    const decoded = safeDecode(token);

    if (decoded) {
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        setIsAuthorized(true);
        setUser(decoded);
        setIsStaff(decoded.is_staff || false); // Set isStaff from token
        setLoading(false);
        return true; // Token is valid
      } else {
        // Token exists but is expired, try refreshing
        const refreshResult = await refreshToken();
        setLoading(false); // refreshToken sets its own loading, but ensure it's false here
        return refreshResult.success;
      }
    }

    // No token or refresh failed
    logout();
    setLoading(false);
    return false;
  }, [logout, refreshToken]); // Added dependencies  // Login method
  const login = async (credentials) => {
    setLoading(true);
    console.log("AuthContext - login attempt with:", {
      email: credentials.email,
    }); // Debug log
    try {
      const res = await api.post("/accounts/token/", credentials);
      console.log("AuthContext - login response status:", res.status); // Debug log
      const { access, refresh } = res.data;

      localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, access);
      if (refresh) localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refresh);
      const decoded = safeDecode(access);
      if (decoded) {
        setIsAuthorized(true);
        setUser(decoded);
        setIsStaff(decoded.is_staff || false); // Set isStaff from token
        setLoading(false);
        console.log("AuthContext - login successful for user:", decoded.email); // Debug log
        return { success: true, user: decoded };
      } else {
        throw new Error("Failed to decode new token.");
      }
    } catch (error) {
      console.error("AuthContext - Login failed:", error);
      if (error.response) {
        console.error("AuthContext - Error response:", error.response.data);
        console.error("AuthContext - Error status:", error.response.status);
      }
      logout(); // Ensure cleanup
      setLoading(false);
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      };
    }
  };
  // On mount, check auth and set up interval refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth(); // Initial check
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setLoading(false); // Ensure loading is false even if checkAuth fails
      }
    };

    initializeAuth();
    const interval = setInterval(() => {
      const token = localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      const decoded = safeDecode(token);

      if (decoded) {
        const now = Date.now() / 1000;
        // Check if token expires in the next 5 minutes (or adjust as needed)
        if (decoded.exp - now < 300) {
          console.log("Token expiring soon, attempting refresh...");
          refreshToken();
        }
      } else if (isAuthorized) {
        // If we think we are authorized but have no token, log out.
        console.log("No token found while authorized, logging out.");
        logout();
      }
    }, 60 * 1000); // check every 1 minute

    // Safety timeout to ensure loading doesn't get stuck
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading timeout - forcing loading to false");
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, [checkAuth, refreshToken, isAuthorized, logout, loading]); // Added dependencies
  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        user,
        isStaff, // Provide isStaff state
        loading, // Provide loading state
        login,
        logout,
        refreshToken,
        checkAuth, // Expose checkAuth function
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
