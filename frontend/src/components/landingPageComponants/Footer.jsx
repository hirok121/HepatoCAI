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
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  ArrowUpward,
  LocalHospital,
  Science,
  Security,
  Support,
} from "@mui/icons-material";

// Matching theme from Hero
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
      color: "#FFFFFF",
      "@media (min-width:600px)": { fontSize: "2.75rem" },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      marginBottom: "0.75rem",
      color: "#FFFFFF",
    },
    h4: { fontWeight: 600, fontSize: "1.25rem", color: "#FFFFFF" },
    h5: { fontWeight: 600, fontSize: "1.125rem", color: "#FFFFFF" },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "rgba(255, 255, 255, 0.85)",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "rgba(255, 255, 255, 0.7)",
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

const StyledFooter = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.hero,
  borderRadius: 0,
  boxShadow: "none",
  background: `linear-gradient(135deg, ${theme.palette.background.hero} 0%, ${
    theme.palette.primary.dark || "#1E3A8A"
  } 100%)`,
  marginTop: 0,
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  marginRight: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    transform: "translateY(-2px)",
  },
}));

const FooterLink = styled(Typography)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.7)",
  cursor: "pointer",
  transition: "color 0.3s ease",
  marginBottom: theme.spacing(1),
  "&:hover": {
    color: "white",
  },
}));

const BackToTopButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  borderRadius: "50%",
  minWidth: "56px",
  height: "56px",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  "&:hover": {
    backgroundColor: "#1D4ED8",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
  },
  zIndex: 1000,
}));

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <ThemeProvider theme={theme}>
      <StyledFooter elevation={0}>
        <Container maxWidth="lg">
          {/* Main Footer Content */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <FooterSection>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                  HepatoCAI
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, maxWidth: "300px" }}>
                  Advanced AI-powered Hepatitis C detection and analysis
                  platform. Empowering healthcare professionals with
                  cutting-edge diagnostic tools.
                </Typography>

                {/* Features */}
                <Box sx={{ mb: 3 }}>
                  {[
                    { icon: <Science />, text: "AI-Powered Diagnostics" },
                    { icon: <LocalHospital />, text: "Medical Grade Accuracy" },
                    { icon: <Security />, text: "HIPAA Compliant" },
                    { icon: <Support />, text: "24/7 Support" },
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, mr: 1 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="body2">{feature.text}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Social Media */}
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Follow Us
                  </Typography>
                  <Box>
                    <SocialIconButton>
                      <Facebook />
                    </SocialIconButton>
                    <SocialIconButton>
                      <Twitter />
                    </SocialIconButton>
                    <SocialIconButton>
                      <LinkedIn />
                    </SocialIconButton>
                    <SocialIconButton>
                      <Instagram />
                    </SocialIconButton>
                  </Box>
                </Box>
              </FooterSection>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  Platform
                </Typography>
                <Box>
                  <FooterLink variant="body2">AI Diagnostics</FooterLink>
                  <FooterLink variant="body2">Medical Assistant</FooterLink>
                  <FooterLink variant="body2">HCV Stages</FooterLink>
                  <FooterLink variant="body2">Research Insights</FooterLink>
                  <FooterLink variant="body2">Clinical Tools</FooterLink>
                </Box>
              </FooterSection>
            </Grid>

            {/* Resources */}
            <Grid item xs={12} sm={6} md={2}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  Resources
                </Typography>
                <Box>
                  <FooterLink variant="body2">Documentation</FooterLink>
                  <FooterLink variant="body2">API Reference</FooterLink>
                  <FooterLink variant="body2">Medical Library</FooterLink>
                  <FooterLink variant="body2">Case Studies</FooterLink>
                  <FooterLink variant="body2">Tutorials</FooterLink>
                </Box>
              </FooterSection>
            </Grid>

            {/* Support */}
            <Grid item xs={12} sm={6} md={2}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  Support
                </Typography>
                <Box>
                  <FooterLink variant="body2">Help Center</FooterLink>
                  <FooterLink variant="body2">Contact Us</FooterLink>
                  <FooterLink variant="body2">Training</FooterLink>
                  <FooterLink variant="body2">System Status</FooterLink>
                  <FooterLink variant="body2">Community</FooterLink>
                </Box>
              </FooterSection>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={2}>
              <FooterSection>
                <Typography variant="h5" gutterBottom>
                  Contact
                </Typography>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Email sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="body2">
                      support@hepatocai.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Phone sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="body2">+1 (555) 123-4567</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <LocationOn
                      sx={{ mr: 1, mt: 0.5, color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2">
                      123 Medical Center Dr
                      <br />
                      Health Innovation District
                      <br />
                      San Francisco, CA 94105
                    </Typography>
                  </Box>
                </Box>
              </FooterSection>
            </Grid>
          </Grid>

          <Divider
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", mb: 3 }}
          />

          {/* Bottom Footer */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", sm: "center" },
              textAlign: { xs: "center", sm: "left" },
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              © {currentYear} HepatoCAI. All rights reserved. | Built with ❤️
              for healthcare innovation
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <FooterLink variant="body2">Privacy Policy</FooterLink>
              <FooterLink variant="body2">Terms of Service</FooterLink>
              <FooterLink variant="body2">Cookie Policy</FooterLink>
              <FooterLink variant="body2">Accessibility</FooterLink>
            </Box>
          </Box>

          {/* Medical Disclaimer */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}
            >
              <strong>Medical Disclaimer:</strong> HepatoCAI is an educational
              and diagnostic assistance platform. All results should be
              interpreted by qualified healthcare professionals. This platform
              does not replace professional medical advice, diagnosis, or
              treatment.
            </Typography>
          </Box>
        </Container>

        {/* Back to Top Button */}
        <BackToTopButton onClick={scrollToTop}>
          <ArrowUpward />
        </BackToTopButton>
      </StyledFooter>
    </ThemeProvider>
  );
};

export default Footer;
