import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../theme/AppTheme";
// import ColorModeSelect from "../../theme/ColorModeSelect";
import api from "../../services/api";
import { GoogleIcon, HepatoCAIIcon } from "../../components/ui/CustomIcons";
import { useLocation, useNavigate } from "react-router-dom";
import { API_CONFIG, API_ENDPOINTS } from "../../config/constants";

// Styled components
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
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

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        severity: "success",
        message: location.state.message,
      });
    }
  }, [location.state]);

  // Input refs (preferred over getElementById in React)
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    let valid = true;

    if (!name) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) return;

    const payload = { full_name: name, email: email, password: password };

    try {
      setLoading(true);
      const response = await api.post("/users/register/", payload);
      console.log("Sign up response:", response.data);

      navigate("/signup", {
        state: { message: "Signup successful. Check your email to verify." },
      });
      // set all fields to empty
      nameRef.current!.value = "";
      emailRef.current!.value = "";
      passwordRef.current!.value = "";
    } catch (err: any) {
      if (err.response?.status === 400) {
        setEmailError(true);
        setSnackbar({
          open: true,
          severity: "error",
          message: "Account already exists.",
        });
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "An error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handlegoogleSignIn = () => {
    window.location.href = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`;
    navigate("/"); // Redirect to home page after successful login
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <HepatoCAIIcon />
          <Typography variant="h4" component="h1">
            Sign up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            width={"100%"}
          >
            <FormControl>
              <FormLabel htmlFor="full_name">Full name</FormLabel>
              <TextField
                inputRef={nameRef}
                id="full_name"
                name="full_name"
                placeholder="Jon Snow"
                required
                fullWidth
                error={nameError}
                helperText={nameError ? "Name is required." : ""}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                inputRef={emailRef}
                id="email"
                name="email"
                placeholder="your@email.com"
                required
                fullWidth
                error={emailError}
                helperText={emailError ? "Enter a valid email address." : ""}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                inputRef={passwordRef}
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                fullWidth
                error={passwordError}
                helperText={
                  passwordError ? "Password must be at least 6 characters." : ""
                }
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
                "Sign Up"
              )}
            </Button>
          </Box>

          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handlegoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>{" "}
            <Typography textAlign="center">
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/signin")}
                variant="body2"
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity as "success" | "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </SignUpContainer>
    </AppTheme>
  );
}
