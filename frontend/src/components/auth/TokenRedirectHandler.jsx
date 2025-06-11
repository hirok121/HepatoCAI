// TokenRedirectHandler.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenRedirectHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're on the home page with auth tokens
    if (location.pathname === "/" && location.search) {
      const urlParams = new URLSearchParams(location.search);
      const access = urlParams.get("access");
      const refresh = urlParams.get("refresh");
      
      console.log("TokenRedirectHandler - Checking for tokens on home page", {
        pathname: location.pathname,
        hasAccess: !!access,
        hasRefresh: !!refresh,
        search: location.search
      });
      
      if (access && refresh) {
        console.log("TokenRedirectHandler - Found tokens, redirecting to AuthCallback");
        // Redirect to AuthCallback with the tokens
        navigate(`/auth/callback${location.search}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return children;
};

export default TokenRedirectHandler;
