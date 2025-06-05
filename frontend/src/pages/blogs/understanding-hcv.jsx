import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Biotech,
  Person,
  AccessTime,
  Category,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import hcvSymptomsImg from "../../assets/blogimages/hcv_symptoms.jpg";
import virusHumanImg from "../../assets/blogimages/virushuman.jpg";

function UnderstandingHCV() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/patient-education")}
          sx={{ mb: 3 }}
        >
          Back to Education
        </Button>{" "}
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={hcvSymptomsImg}
            alt="Understanding Hepatitis C"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Biotech sx={{ mr: 1, color: "primary.main" }} />
              <Chip
                label="Research"
                color="primary"
                variant="outlined"
                icon={<Category />}
              />
              <Chip
                label="Featured"
                color="secondary"
                variant="filled"
                sx={{ ml: 1 }}
              />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Understanding Hepatitis C: From Detection to Treatment
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Explore the latest advancements in HCV detection using AI-powered
              diagnostic tools and biomarker analysis for early intervention.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <Avatar sx={{ mr: 2 }}>SJ</Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  Dr. Sarah Johnson
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <AccessTime
                    sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    May 20, 2025 • 5 min read
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            The Evolution of HCV Detection
          </Typography>
          <Typography paragraph>
            Hepatitis C virus (HCV) detection has undergone a revolutionary
            transformation with the integration of artificial intelligence and
            advanced biomarker analysis. Traditional diagnostic methods, while
            effective, often missed early-stage infections that could progress
            to severe liver damage.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            AI-Powered Diagnostic Tools
          </Typography>
          <Typography paragraph>
            Modern AI diagnostic systems analyze multiple data points
            simultaneously, including liver enzyme levels, patient demographics,
            and biochemical markers. These systems can identify patterns that
            human analysis might miss, leading to earlier and more accurate
            diagnoses.
          </Typography>
          <Paper sx={{ p: 3, my: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom color="primary">
              Key Diagnostic Biomarkers
            </Typography>
            <Typography component="div">
              • <strong>ALT (Alanine Aminotransferase):</strong> Primary liver
              enzyme indicator
              <br />• <strong>AST (Aspartate Aminotransferase):</strong>{" "}
              Secondary liver function marker
              <br />• <strong>Bilirubin levels:</strong> Indicator of liver
              processing capacity
              <br />• <strong>Platelet count:</strong> Marker for potential
              liver damage
              <br />• <strong>Age and gender factors:</strong> Important
              demographic considerations
            </Typography>
          </Paper>{" "}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Early Intervention Benefits
          </Typography>
          <Box sx={{ my: 3, textAlign: "center" }}>
            <CardMedia
              component="img"
              height="300"
              image={virusHumanImg}
              alt="Hepatitis C virus and human interaction"
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: "100%",
                mx: "auto",
                display: "block",
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Understanding the interaction between Hepatitis C virus and human
              health
            </Typography>
          </Box>
          <Typography paragraph>
            Early detection of hepatitis C enables timely intervention, which is
            crucial for preventing progression to cirrhosis or liver cancer.
            With modern direct-acting antiviral treatments, patients diagnosed
            early have cure rates exceeding 95%.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Clinical Implementation
          </Typography>
          <Typography paragraph>
            Healthcare providers are increasingly adopting AI-assisted
            diagnostic tools in clinical practice. These tools don't replace
            physician judgment but enhance diagnostic accuracy and help identify
            high-risk patients who might otherwise go undiagnosed.
          </Typography>
          <Typography paragraph>
            The integration of machine learning algorithms with traditional
            laboratory testing represents a significant advancement in hepatitis
            C management, offering hope for better patient outcomes and reduced
            healthcare costs.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Future Directions
          </Typography>
          <Typography paragraph>
            Research continues into improving AI diagnostic accuracy and
            expanding accessibility to underserved populations. The goal is to
            make advanced hepatitis C detection available globally, particularly
            in regions with high infection rates but limited healthcare
            infrastructure.
          </Typography>
          {/* YouTube Video Section */}
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Understanding Hepatitis C: Comprehensive Overview
            </Typography>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%" /* 16:9 aspect ratio */,
                height: 0,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: "100%",
                mx: "auto",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/eocRM7MhF68"
                title="Understanding Hepatitis C: Comprehensive Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Educational video providing comprehensive information about
              Hepatitis C virus, detection, and management
            </Typography>
          </Box>
        </Box>
        <Card sx={{ bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clinical Impact
            </Typography>
            <Typography>
              AI-powered hepatitis C detection represents a paradigm shift in
              liver disease management, enabling healthcare providers to
              intervene earlier and more effectively than ever before.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default UnderstandingHCV;
