import * as React from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Link,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTheme from "../../theme/AppTheme";
import { HepatoCAIIcon } from "../../components/ui/CustomIcons";
import api from "../../services/api";

// Styled components
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#181A20",
    color: "#fff",
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const Container = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "error" as "error" | "success",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: typeof errors = {};
    const token = params.get("token");

    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!token) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Invalid or missing reset token.",
      });
      return;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("users/reset-password/confirm/", {
        password,
        token,
      });
      navigate("/signin", {
        state: { message: "Password reset successfully. Please sign in." },
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Password reset failed. Try again or request a new link.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />{" "}
      <Container direction="column" justifyContent="center">
        <Card variant="outlined">
          <HepatoCAIIcon />
          <Typography component="h1" variant="h4">
            Set New Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            width={"100%"}
          >
            <FormControl>
              <FormLabel htmlFor="password">New Password</FormLabel>
              <TextField
                id="password"
                type="password"
                name="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              ) : (
                "Reset Password"
              )}
            </Button>
          </Box>{" "}
          <Divider />
          <Typography sx={{ textAlign: "center" }}>
            Know your password?{" "}
            <Link
              variant="body2"
              onClick={() => navigate("/signin")}
              sx={{ cursor: "pointer" }}
            >
              Sign in
            </Link>
          </Typography>
        </Card>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AppTheme>
  );
}
