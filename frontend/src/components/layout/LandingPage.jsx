import { Box } from "@mui/material";
import NavBar from "./NavBar";
import Hero from "../landingPageComponents/Hero";
import DiagnosticToolSection from "../landingPageComponents/DiagnosticToolSection";
import ProblemSection from "../landingPageComponents/ProblemSection";
import AiMedicalAssistant from "../landingPageComponents/AiMedicalAssistant";
import Footer from "../landingPageComponents/Footer";
import BlogSection from "../landingPageComponents/BlogSection";

export default function LandingPage() {
  return (
    <Box>
      <NavBar />
      <Hero />
      <ProblemSection id="problem-section" />
      <DiagnosticToolSection id="diagnostic-tool" />
      <AiMedicalAssistant id="ai-medical-assistant" />
      <BlogSection id="blog-section" />
      <Footer />
    </Box>
  );
}
