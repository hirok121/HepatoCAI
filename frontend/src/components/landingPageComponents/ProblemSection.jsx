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
import { Analytics, LibraryBooks } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import WorldImageSection from "./WorldImageSection";
import ChallengeFeatures from "./ChallengeFeatures";
import EarlyDetectionBenefits from "./EarlyDetectionBenefits";
import HopeImageSection from "./HopeImageSection";

// Animations
const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const StyledSection = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.background.sectionDefault,
  borderRadius: 0,
  boxShadow: "none",
  background: theme.palette.background.sectionDefault,
  "@media (max-width: 600px)": {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

const AnimatedBox = styled(Box)(({ animationDelay = "0s" }) => ({
  animation: `${fadeInAnimation} 0.8s ease-out ${animationDelay} both`,
}));

const theme = createTheme({
  palette: {
    primary: { main: "#2563EB" },
    secondary: { main: "#4F46E5" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
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
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      marginBottom: "1rem",
      color: "#1E293B",
      "@media (min-width:600px)": { fontSize: "2.75rem" },
    },
    h5: {
      fontSize: "1.125rem",
      color: "#475569",
      lineHeight: 1.7,
      "@media (min-width:600px)": { fontSize: "1.25rem" },
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "#475569",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#64748B",
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
          color: "#2563EB",
          "&:hover": {
            backgroundColor: "rgba(37, 99, 235, 0.04)",
            borderColor: "#1D4ED8",
          },
        },
      },
    },
  },
});

const ProblemSection = ({ id }) => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <StyledSection
        id={id}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          mt: 0,
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          {/* Title section */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
              HCV: The Challenge & <br />
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                The Need for Early Action
              </Box>
            </Typography>
            <Typography
              variant="h5"
              paragraph
              sx={{
                mb: 3,
                maxWidth: "100%",
                mx: { xs: "auto", sm: 0 },
                color: "#475569",
                fontWeight: 400,
              }}
            >
              Hepatitis C (HCV) is a major global health issue. Understanding
              its challenges highlights the critical importance of{" "}
              <Box
                component="span"
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: 600,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                early detection and intervention
              </Box>{" "}
              to prevent severe complications and improve patient outcomes.
            </Typography>
          </Box>

          <AnimatedBox animationDelay="0s">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: 4, sm: 6, md: 8, lg: 10 },
                  width: "80%",
                }}
              >
                {/* World Image Component */}
                <WorldImageSection animationDelay="0.2s" />
                {/* Challenge Features Component */}
                <ChallengeFeatures theme={theme} />
              </Box>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: 4, sm: 6, md: 8, lg: 10 },
                  width: "80%",
                }}
              >
                {/* Early Detection Benefits Component */}
                <EarlyDetectionBenefits />
                {/* Hope Image Component - Right side */}
                <HopeImageSection animationDelay="0.4s" />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<Analytics />}
                onClick={() => navigate("/patient-education")}
                sx={{
                  minWidth: "200px",
                  fontSize: "1rem",
                }}
              >
                Learn More
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                endIcon={<LibraryBooks />}
                onClick={() => navigate("/research")}
                sx={{
                  minWidth: "180px",
                }}
              >
                View Researches
              </Button>
            </Box>
          </AnimatedBox>
        </Container>
      </StyledSection>
    </ThemeProvider>
  );
};

export default ProblemSection;
