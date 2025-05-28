import React from "react";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import Hero from "./landingPageComponants/Hero";
import DiagnosticToolSection from "./landingPageComponants/DiagnosticToolSection";
import ProblemSection from "./landingPageComponants/ProblemSection";
import AiMedicalAssistant from "./landingPageComponants/AiMedicalAssistant";
import Footer from "./landingPageComponants/Footer";
import BlogSection from "./landingPageComponants/BlogSection";

export default function LandingPage() {
  return (
    // <AppTheme>
    <Box>
      <NavBar />
      <Hero />
      <ProblemSection id="problem-section" />
      <DiagnosticToolSection id="diagnostic-tool" />
      <AiMedicalAssistant id="ai-medical-assistant" />
      <BlogSection id="blog-section" />
      <Footer />
    </Box>
    // </AppTheme>
  );
}
