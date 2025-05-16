// AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const access = params.get("access");
    const refresh = params.get("refresh");
    // console.log("Access Token:", access); // Uncomment this line to log the access token
    // console.log("Refresh Token:", refresh); // Uncomment this line to log the refresh token
    if (access && refresh) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      axios
        .get("http://localhost:8000/users/profile/me")
        .then((response) => {
          // console.log("User data:", response.data); // Uncomment this line to log the user data
          navigate("/");
        })
        .catch((error) => {
          console.error(
            "Error verfiying token:",
            error.response ? error.response.data : error.message
          );
          navigate("/signin");
        });
    } else {
      navigate("/signin?error=token_missing");
    }
  }, [params, navigate]);

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
