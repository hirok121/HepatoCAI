// TokenRedirectHandler.jsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenRedirectHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // Prevent multiple redirects

  useEffect(() => {
    // Check if we're on the home page with auth tokens and haven't redirected yet
    if (location.pathname === "/" && location.search && !hasRedirected.current) {
      const urlParams = new URLSearchParams(location.search);
      const access = urlParams.get("access");
      const refresh = urlParams.get("refresh");
      
      console.log("TokenRedirectHandler - Checking for tokens on home page", {
        pathname: location.pathname,
        hasAccess: !!access,
        hasRefresh: !!refresh,
        search: location.search,
        hasRedirected: hasRedirected.current
      });
      
      if (access && refresh) {
        console.log("TokenRedirectHandler - Found tokens, redirecting to AuthCallback");
        hasRedirected.current = true; // Mark as redirected to prevent loops
        
        // Redirect to AuthCallback with the tokens
        navigate(`/auth/callback${location.search}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return children;
};

export default TokenRedirectHandler;
