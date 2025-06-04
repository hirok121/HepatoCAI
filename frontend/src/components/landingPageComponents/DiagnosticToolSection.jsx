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
import {
  Analytics,
  Speed,
  Security,
  CheckCircle,
  Timeline,
  Biotech,
  Assessment,
  Psychology,
  DataObject,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import diagnosticImage from "../../assets/diagnostictool-image.png";

// Animations
const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components - Different background from Hero
const StyledSection = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.background.sectionDefault, // Light background instead
  borderRadius: 0,
  boxShadow: "none",
  // Remove the gradient - use solid light background
  background: theme.palette.background.sectionDefault,
  "@media (max-width: 600px)": {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "animationDelay",
})(({ animationDelay = "0s" }) => ({
  animation: `${fadeInAnimation} 0.8s ease-out ${animationDelay} both`,
}));

const DiagnosticImage = styled("img")(({ theme }) => ({
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

// Update theme for light background
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
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      marginBottom: "1rem",
      color: "#1E293B", // Dark text for light background
      "@media (min-width:600px)": { fontSize: "2.75rem" },
    },
    h5: {
      fontSize: "1.125rem",
      color: "#475569", // Dark text for light background
      lineHeight: 1.7,
      "@media (min-width:600px)": { fontSize: "1.25rem" },
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "#475569", // Dark text for light background
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "rgba(255, 255, 255, 0.75)",
    },
    subtitle1: {
      fontSize: "1.125rem",
      color: "rgba(255, 255, 255, 0.85)",
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
          borderColor: "rgba(255, 255, 255, 0.3)",
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
        },
      },
    },
  },
});

const DiagnosticToolSection = ({ id }) => {
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: 4, md: 12 },
              minHeight: "80vh",
            }}
          >
            {/* Image content - Left side */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 40%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: { xs: "100%", sm: "40%" },
              }}
            >
              <AnimatedBox
                animationDelay="0s"
                sx={{
                  width: "100%",
                  maxWidth: {
                    xs: "380px",
                    sm: "350px",
                    md: "400px",
                    lg: "450px",
                  },
                }}
              >
                <DiagnosticImage
                  src={diagnosticImage}
                  alt="AI diagnostic tool interface showing HCV analysis"
                />
              </AnimatedBox>
            </Box>

            {/* Text content - Right side */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", sm: "1 1 60%" },
                textAlign: { xs: "center", sm: "left" },
                maxWidth: { xs: "100%", sm: "60%" },
              }}
            >
              <AnimatedBox animationDelay="0.2s">
                <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
                  From Data to Insight: <br />
                  <Box
                    component="span"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    HCV Detection
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  paragraph
                  sx={{
                    mb: 3, // Reduced from mb: 4
                    maxWidth: { xs: "90%", sm: "55ch" },
                    mx: { xs: "auto", sm: 0 },
                    color: "#475569",
                    fontWeight: 400,
                  }}
                >
                  Transform complex hepatitis C diagnostics into instant
                  insights. Our advanced machine learning platform processes
                  multiple biomarkers
                  <Box
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      backgroundColor: "rgba(37, 99, 235, 0.1)",
                      px: 1,
                      py: 0.25,
                      borderRadius: "4px",
                    }}
                  >
                    from liver enzymes to demographic factors
                  </Box>
                  delivering precise fibrosis stage predictions with
                  transparent, explainable AI reasoning you can trust.
                </Typography>

                {/* How It Works Features */}
                <Box sx={{ mb: 4 }}>
                  {[
                    {
                      icon: <DataObject />,
                      title: "Multi-Parameter Analysis",
                      desc: "Analyzes Age, ALP, AST, CHE, CREA, CGT and other biomarkers",
                    },
                    {
                      icon: <Biotech />,
                      title: "Logistic Regression Model",
                      desc: "Top-performing ML algorithm for HCV stage classification",
                    },
                    {
                      icon: <Psychology />,
                      title: "SHAP Explainability",
                      desc: "Transparent AI reasoning for every prediction made",
                    },
                    {
                      icon: <Analytics />,
                      title: "Stage Likelihood Prediction",
                      desc: "Probability scores for different HCV fibrosis stages",
                    },
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 2, // Reduced from mb: 3
                        justifyContent: { xs: "center", sm: "flex-start" },
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      <Box
                        sx={{
                          color: theme.palette.primary.main,
                          mr: 3,
                          mt: 0.5,
                          minWidth: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(37, 99, 235, 0.1)",
                          borderRadius: "8px",
                          p: 1,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1E293B",
                            mb: 0.5,
                            fontSize: "1rem",
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.875rem",
                          }}
                        >
                          {feature.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Updated CTA Section */}
                <Box
                  sx={{
                    p: 2, // Reduced from p: 3
                    backgroundColor: "rgba(37, 99, 235, 0.05)",
                    borderRadius: "12px",
                    border: "1px solid rgba(37, 99, 235, 0.1)",
                    mb: 3, // Reduced from mb: 4
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircle sx={{ color: "#059669", mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#059669", fontWeight: 600 }}
                    >
                      Research-Grade AI Models
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#475569", mb: 2 }}>
                    Conceptual framework designed for educational and research
                    purposes in hepatitis C stage prediction methodology.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<Assessment />}
                  onClick={() => navigate("/diagnosis")}
                  sx={{
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 2, sm: 0 },
                    minWidth: "200px",
                    fontSize: "1rem",
                  }}
                >
                  Explore Detection
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  endIcon={<Timeline />}
                  onClick={() => navigate("/methodology")}
                  sx={{
                    minWidth: "180px",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.04)",
                      borderColor: "#1D4ED8",
                    },
                  }}
                >
                  View Methodology
                </Button>
              </AnimatedBox>
            </Box>
          </Box>
        </Container>
      </StyledSection>
    </ThemeProvider>
  );
};

export default DiagnosticToolSection;
