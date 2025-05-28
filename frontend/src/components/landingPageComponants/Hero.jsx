import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import heroImage from "../../assets/hero.png";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: "#2563EB" },
    secondary: { main: "#4F46E5" },
    background: {
      default: "#F0F4F8",
      paper: "#FFFFFF",
      hero: "#0F172A",
      sectionAlternate: "#FFFFFF",
      sectionDefault: "#F0F4F8",
    },
    text: {
      primary: "#1E293B",
      secondary: "#475569",
      heroPrimary: "#FFFFFF",
      heroSecondary: "rgba(255, 255, 255, 0.85)",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      color: "white",
      "@media (min-width:600px)": { fontSize: "3rem" },
      "@media (min-width:900px)": { fontSize: "3.75rem" },
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      marginBottom: "1rem",
      color: "#1E293B",
      "@media (min-width:600px)": { fontSize: "2.75rem" },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      marginBottom: "0.75rem",
      color: "#1E293B",
    },
    h4: { fontWeight: 600, fontSize: "1.25rem", color: "#1E293B" },
    body1: { fontSize: "1rem", lineHeight: 1.7, color: "#475569" },
    body2: { fontSize: "0.875rem", lineHeight: 1.6, color: "#64748B" },
    subtitle1: {
      fontSize: "1.125rem",
      color: "#475569",
      marginBottom: "3rem",
      maxWidth: "70ch",
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: 1.7,
      "@media (min-width:600px)": { fontSize: "1.25rem" },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "none",
          transition: "background-color 0.3s ease, transform 0.2s ease",
        },
        containedPrimary: {
          color: "white",
          "&:hover": { backgroundColor: "#1D4ED8", transform: "scale(1.03)" },
        },
        containedSizeLarge: { padding: "12px 28px", fontSize: "1rem" },
        outlinedPrimary: {
          borderColor: "#2563EB",
          "&:hover": {
            backgroundColor: "rgba(37, 99, 235, 0.04)",
            borderColor: "#1D4ED8",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            borderColor: "#CBD5E1",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { transition: "box-shadow 0.3s ease" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)",
        },
      },
    },
  },
});

// Animations
const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledSection = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.background.hero,
  borderRadius: 0,
  boxShadow: "none",
  background: `linear-gradient(135deg, ${theme.palette.background.hero} 0%, ${
    theme.palette.primary.dark || "#1E3A8A"
  } 100%)`,
  "@media (max-width: 600px)": {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

const AnimatedBox = styled(Box)(({ animationDelay = "0s" }) => ({
  animation: `${fadeInAnimation} 0.8s ease-out ${animationDelay} both`,
}));

const HeroImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: "12px",
  boxShadow: theme.shadows[3],
  objectFit: "cover",
  maxHeight: "450px",
  "@media (max-width: 600px)": {
    maxHeight: "300px",
  },
}));

const Hero = () => (
  <ThemeProvider theme={theme}>
    <StyledSection
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        mt: 0,
        pt: { xs: 6, md: 10 },
        pb: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 6 },
            height: "80vh", // Changed from minHeight: "60vh" to height: "100vh"
          }}
        >
          {/* Text content - Left side */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 66.66%" },
              textAlign: { xs: "center", sm: "left" },
              maxWidth: { xs: "100%", sm: "66.66%" },
            }}
          >
            <AnimatedBox animationDelay="0s">
              <Typography variant="h1" gutterBottom sx={{ mb: 3 }}>
                Advanced HCV <br /> Stage Detection <br />
                <Box
                  component="span"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Powered by AI
                </Box>
              </Typography>
              <Typography
                variant="h5"
                color="text.heroSecondary"
                paragraph
                sx={{
                  mb: 4,
                  maxWidth: { xs: "90%", sm: "55ch" },
                  mx: { xs: "auto", sm: 0 },
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                Leveraging cutting-edge artificial intelligence to provide rapid
                and accurate Hepatitis C stage analysis. Empowering healthcare
                through innovation.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  document.getElementById("diagnostic-tool")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                sx={{
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 2, sm: 0 },
                  minWidth: "180px",
                }}
              >
                Learn About AI Diagnostics
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => {
                  document
                    .getElementById("ai-medical-assistant")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                sx={{
                  minWidth: "180px",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Ask Your AI Medical Assistant
              </Button>
            </AnimatedBox>
          </Box>

          {/* Image content - Right side */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 33.33%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: { xs: "100%", sm: "33.33%" },
            }}
          >
            <AnimatedBox
              animationDelay="0.2s"
              sx={{
                width: "100%",
                maxWidth: {
                  xs: "380px",
                  sm: "300px",
                  md: "350px",
                  lg: "400px",
                },
              }}
            >
              <HeroImage
                src={heroImage}
                alt="AI assisting medical professional in HCV detection"
              />
            </AnimatedBox>
          </Box>
        </Box>
      </Container>
    </StyledSection>
  </ThemeProvider>
);

export default Hero;
