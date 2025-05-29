import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Psychology,
  HealthAndSafety,
  Medication,
  Timeline,
  Chat,
  SmartToy,
  LocalHospital,
  MenuBook,
  Science,
  AutoAwesome,
  School,
  Support,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Animations
const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled components - Matching DiagnosticToolSection
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

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "16px",
  border: "1px solid rgba(37, 99, 235, 0.1)",
  boxShadow: "0 4px 20px rgba(37, 99, 235, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 40px rgba(37, 99, 235, 0.15)",
    borderColor: "rgba(37, 99, 235, 0.2)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: "64px",
  height: "64px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: "white",
  marginBottom: theme.spacing(2),
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

// Matching theme from DiagnosticToolSection
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
      color: "#1E293B",
      "@media (min-width:600px)": { fontSize: "2.75rem" },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#1E293B",
      marginBottom: "0.5rem",
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
      color: "#475569",
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

const AiMedicalAssistant = ({ id }) => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Psychology />,
      title: "HCV Stage Education",
      desc: "Comprehensive guidance on fibrosis stages F0-F4, understanding disease progression, and what each stage means for your health journey.",
    },
    {
      icon: <HealthAndSafety />,
      title: "Symptom Analysis",
      desc: "Detailed explanations of HCV symptoms, from early signs to advanced stages, helping you recognize and understand your health indicators.",
    },
    {
      icon: <Medication />,
      title: "Treatment Options",
      desc: "In-depth information on DAA therapies, medication protocols, side effects management, and treatment success rates.",
    },
    {
      icon: <Science />,
      title: "Research Insights",
      desc: "Latest medical research findings, clinical trial results, and evidence-based treatment guidelines from leading hepatology sources.",
    },
    {
      icon: <School />,
      title: "Patient Education",
      desc: "Clear, easy-to-understand explanations of complex medical concepts, lab results, and liver function terminology.",
    },
    {
      icon: <Support />,
      title: "Care Support",
      desc: "Guidance on lifestyle modifications, dietary recommendations, and supportive care strategies during treatment.",
    },
  ];

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
          {/* Header Section */}
          <AnimatedBox animationDelay="0.1s">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <AutoAwesome
                  sx={{ color: theme.palette.primary.main, fontSize: "2rem" }}
                />
                <Typography variant="h2">
                  Your Intelligent{" "}
                  <Box
                    component="span"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    HCV Health Companion
                  </Box>
                </Typography>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  maxWidth: "80ch",
                  mx: "auto",
                  color: "#475569",
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                Get instant, evidence-based answers about Hepatitis C. Our AI
                assistant provides{" "}
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
                  personalized guidance on stages, symptoms, treatments
                </Box>{" "}
                and medications, helping you understand your HCV journey with
                reliable, up-to-date medical information.
              </Typography>

              {/* Educational Notice */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                  backgroundColor: "rgba(37, 99, 235, 0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(37, 99, 235, 0.1)",
                  mb: 4,
                }}
              >
                <LocalHospital sx={{ color: "#059669" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#059669", fontWeight: 600 }}
                >
                  Educational Medical Information
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  • Always consult healthcare professionals for medical advice
                </Typography>
              </Box>
            </Box>
          </AnimatedBox>

          {/* Features Grid */}
          <AnimatedBox animationDelay="0.3s">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                mb: 6,
              }}
            >
              {/* First Row - 3 items */}
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  flexWrap: { xs: "wrap", lg: "nowrap" },
                }}
              >
                {features.slice(0, 3).map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: { xs: "1 1 100%", sm: "1 1 45%", lg: "1 1 30%" },
                      maxWidth: { xs: "100%", sm: "45%", lg: "30%" },
                      minWidth: "280px",
                    }}
                  >
                    <FeatureCard>
                      <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <IconWrapper
                          sx={{ mx: "auto", animationDelay: `${index * 0.5}s` }}
                        >
                          {feature.icon}
                        </IconWrapper>
                        <Typography variant="h3" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748B" }}>
                          {feature.desc}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </Box>
                ))}
              </Box>

              {/* Second Row - 3 items */}
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  flexWrap: { xs: "wrap", lg: "nowrap" },
                }}
              >
                {features.slice(3, 6).map((feature, index) => (
                  <Box
                    key={index + 3}
                    sx={{
                      flex: { xs: "1 1 100%", sm: "1 1 45%", lg: "1 1 30%" },
                      maxWidth: { xs: "100%", sm: "45%", lg: "30%" },
                      minWidth: "280px",
                    }}
                  >
                    <FeatureCard>
                      <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <IconWrapper
                          sx={{
                            mx: "auto",
                            animationDelay: `${(index + 3) * 0.5}s`,
                          }}
                        >
                          {feature.icon}
                        </IconWrapper>
                        <Typography variant="h3" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748B" }}>
                          {feature.desc}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </Box>
                ))}
              </Box>
            </Box>
          </AnimatedBox>

          {/* CTA Section */}
          <AnimatedBox animationDelay="0.5s">
            <Box
              sx={{
                textAlign: "center",
                p: 4,
                backgroundColor: "rgba(37, 99, 235, 0.02)",
                borderRadius: "20px",
                border: "1px solid rgba(37, 99, 235, 0.08)",
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, maxWidth: "60ch", mx: "auto" }}
              >
                Begin your journey with our AI-powered medical assistant and
                access comprehensive HCV information tailored to your needs.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<Chat />}
                  onClick={() => navigate("/ai-assistant")}
                  sx={{
                    minWidth: "200px",
                    fontSize: "1rem",
                  }}
                >
                  Chat with AI Assistant
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  endIcon={<MenuBook />}
                  onClick={() => navigate("/research")}
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
                  Medical Library
                </Button>
              </Box>
            </Box>
          </AnimatedBox>
        </Container>
      </StyledSection>
    </ThemeProvider>
  );
};

export default AiMedicalAssistant;
