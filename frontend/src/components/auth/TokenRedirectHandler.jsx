// TokenRedirectHandler.jsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TokenRedirectHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // Prevent multiple redirects
  useEffect(() => {
    // Check if we're on the home page with auth tokens and haven't redirected yet
    if (
      location.pathname === "/" &&
      location.search &&
      !hasRedirected.current
    ) {
      const urlParams = new URLSearchParams(location.search);
      const access = urlParams.get("access");
      const refresh = urlParams.get("refresh");
      const resetPasswordConfirm = urlParams.get("reset-password-confirm");
      const resetPassword = urlParams.get("reset-password");
      const signin = urlParams.get("signin");
      const token = urlParams.get("token");

      console.log("TokenRedirectHandler - Checking for tokens on home page", {
        pathname: location.pathname,
        hasAccess: !!access,
        hasRefresh: !!refresh,
        hasResetPasswordConfirm: !!resetPasswordConfirm,
        hasResetPassword: !!resetPassword,
        hasSignin: !!signin,
        hasToken: !!token,
        search: location.search,
        hasRedirected: hasRedirected.current,
      });

      // Handle OAuth callback with auth tokens
      if (access && refresh) {
        console.log(
          "TokenRedirectHandler - Found auth tokens, redirecting to AuthCallback"
        );
        hasRedirected.current = true; // Mark as redirected to prevent loops

        // Redirect to AuthCallback with the tokens
        navigate(`/auth/callback${location.search}`, { replace: true });
      } // Handle reset password confirmation
      else if (resetPasswordConfirm === "true" && token) {
        console.log(
          "TokenRedirectHandler - Found reset password confirmation, redirecting"
        );
        hasRedirected.current = true; // Mark as redirected to prevent loops

        // Redirect to reset password confirmation with the token
        navigate(`/resetpassword/confirm?token=${token}`, { replace: true });
      }
      // Handle base reset password
      else if (resetPassword === "true") {
        console.log(
          "TokenRedirectHandler - Found reset password request, redirecting"
        );
        hasRedirected.current = true; // Mark as redirected to prevent loops

        // Redirect to reset password page
        navigate(`/resetpassword`, { replace: true });
      }
      // Handle signin
      else if (signin === "true") {
        console.log("TokenRedirectHandler - Found signin request, redirecting");
        hasRedirected.current = true; // Mark as redirected to prevent loops

        // Redirect to signin page
        navigate(`/signin`, { replace: true });
      }
    }
  }, [location, navigate]);

  return children;
};

export default TokenRedirectHandler;
