// AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../hooks/AuthContext";
import { AUTH_CONFIG } from "../../config/constants";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); // Get checkAuth function from AuthContext
  useEffect(() => {
    // Add a debug log to confirm the component is loading
    console.log(
      "AuthCallback component mounted, current URL:",
      window.location.href
    );

    const access = params.get("access");
    const refresh = params.get("refresh");
    const error = params.get("error");

    console.log("AuthCallback - URL params:", {
      access: !!access,
      refresh: !!refresh,
      error,
      fullUrl: window.location.href,
    }); // Debug log

    if (error) {
      console.error("AuthCallback - OAuth error:", error);
      navigate("/signin?error=" + encodeURIComponent(error));
      return;
    }
    if (access && refresh) {
      try {
        // Use AUTH_CONFIG constants for consistency
        localStorage.setItem(AUTH_CONFIG.ACCESS_TOKEN_KEY, access);
        localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refresh);
        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

        console.log("AuthCallback - Tokens stored, calling checkAuth");

        // Add a small delay to ensure tokens are properly stored
        setTimeout(async () => {
          try {
            const isValid = await checkAuth();
            console.log("AuthCallback - checkAuth result:", isValid);
            if (isValid) {
              console.log("AuthCallback - Redirecting to home");
              navigate("/", { replace: true });
            } else {
              console.log(
                "AuthCallback - Invalid token, redirecting to signin"
              );
              navigate("/signin?error=invalid_token", { replace: true });
            }
          } catch (error) {
            console.error(
              "AuthCallback - Error verifying token:",
              error.response ? error.response.data : error.message
            );
            navigate("/signin?error=auth_failed", { replace: true });
          }
        }, 100);
      } catch (error) {
        console.error("AuthCallback - Error storing tokens:", error);
        navigate("/signin?error=storage_failed", { replace: true });
      }
    } else {
      console.error("AuthCallback - Missing tokens", {
        access: !!access,
        refresh: !!refresh,
      });
      navigate("/signin?error=token_missing", { replace: true });
    }
  }, [params, navigate, checkAuth]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9fafb"
    >
      <CircularProgress
        size={60}
        thickness={4.5}
        sx={{ color: "primary.main", mb: 4 }}
      />
      <Typography variant="h5" fontWeight={600} color="text.primary">
        Signing you in...
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        Please wait while we log you in securely.
      </Typography>
    </Box>
  );
};

export default AuthCallback;
