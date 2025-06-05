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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack,
  Science,
  AccessTime,
  Category,
  Biotech,
  Analytics,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import hcvSymptoms2Img from "../../assets/blogimages/hcv_symptoms2.jpg";
import testImg from "../../assets/blogimages/test.jpg";

function BiomarkerAnalysis() {
  const navigate = useNavigate();

  const biomarkers = [
    {
      name: "ALT (Alanine Aminotransferase)",
      description: "Primary indicator of liver cell damage and inflammation",
    },
    {
      name: "AST (Aspartate Aminotransferase)",
      description:
        "Secondary liver enzyme marker, also found in heart and muscle",
    },
    {
      name: "Bilirubin",
      description: "Measures liver's ability to process waste products",
    },
    {
      name: "Platelet Count",
      description: "Decreased levels may indicate liver fibrosis or cirrhosis",
    },
    {
      name: "Albumin",
      description:
        "Protein produced by liver, low levels suggest liver dysfunction",
    },
  ];

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
            image={hcvSymptoms2Img}
            alt="Biomarker Analysis"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Science sx={{ mr: 1, color: "primary.main" }} />
              <Chip
                label="Clinical Science"
                color="success"
                variant="outlined"
                icon={<Category />}
              />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Biomarker Analysis: The Future of HCV Diagnosis
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Deep dive into multi-parameter analysis using liver enzymes,
              demographic factors, and biochemical markers for precise
              diagnosis.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <Avatar sx={{ mr: 2 }}>ER</Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  Dr. Emily Rodriguez
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <AccessTime
                    sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    May 15, 2025 • 6 min read
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            The Science of Biomarker Analysis
          </Typography>
          <Typography paragraph>
            Biomarker analysis represents the cutting edge of hepatitis C
            diagnosis, moving beyond single-parameter testing to comprehensive
            multi-dimensional assessment. This approach combines traditional
            liver function tests with demographic data and advanced biochemical
            markers to create a complete diagnostic picture.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Core Biomarkers in HCV Diagnosis
          </Typography>
          <List>
            {biomarkers.map((biomarker, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={biomarker.name}
                  secondary={biomarker.description}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Multi-Parameter Analysis Approach
          </Typography>
          <Typography paragraph>
            Traditional diagnostic methods often rely on single biomarkers or
            simple ratios. Our advanced approach integrates multiple parameters
            simultaneously, creating a comprehensive diagnostic profile that
            accounts for individual patient variations and provides more
            accurate assessments.
          </Typography>
          <Paper sx={{ p: 3, my: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom color="primary">
              Integrated Analysis Components
            </Typography>
            <Typography component="div">
              <strong>Laboratory Parameters:</strong>
              <br />
              • Liver enzymes (ALT, AST, GGT)
              <br />
              • Bilirubin fractions (total, direct, indirect)
              <br />
              • Protein markers (albumin, globulin)
              <br />
              • Coagulation factors (PT/INR)
              <br />
              • Complete blood count with differential
              <br />
              <br />
              <strong>Demographic Factors:</strong>
              <br />
              • Age and gender considerations
              <br />
              • Body mass index and metabolic factors
              <br />
              • Ethnicity and genetic predisposition
              <br />
              • Geographic and environmental factors
              <br />
              <br />
              <strong>Clinical History:</strong>
              <br />
              • Duration of suspected infection
              <br />
              • Previous treatments and responses
              <br />
              • Comorbid conditions
              <br />• Medication history and interactions
            </Typography>
          </Paper>{" "}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Precision Diagnosis Benefits
          </Typography>
          <Box sx={{ my: 3, textAlign: "center" }}>
            <CardMedia
              component="img"
              height="280"
              image={testImg}
              alt="Medical Testing and Laboratory Analysis"
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
              Advanced laboratory testing for comprehensive biomarker analysis
            </Typography>
          </Box>
          <Typography paragraph>
            The multi-parameter approach offers several advantages over
            traditional diagnostic methods:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • <strong>Increased Sensitivity:</strong> Detects early-stage
            disease that single biomarkers might miss
            <br />• <strong>Improved Specificity:</strong> Reduces false
            positives by considering multiple factors
            <br />• <strong>Personalized Assessment:</strong> Accounts for
            individual patient characteristics
            <br />• <strong>Risk Stratification:</strong> Provides more accurate
            prognosis and treatment planning
            <br />• <strong>Monitoring Capability:</strong> Tracks disease
            progression and treatment response
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Advanced Biochemical Markers
          </Typography>
          <Typography paragraph>
            Beyond traditional liver function tests, emerging biomarkers provide
            additional diagnostic insights:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • <strong>Hyaluronic Acid:</strong> Marker of liver fibrosis
            <br />• <strong>Type IV Collagen:</strong> Indicates extracellular
            matrix changes
            <br />• <strong>Laminin:</strong> Basement membrane component,
            elevated in fibrosis
            <br />• <strong>Alpha-2-Macroglobulin:</strong> Protease inhibitor,
            useful in fibrosis assessment
            <br />• <strong>Haptoglobin:</strong> Acute phase protein with
            diagnostic value
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Clinical Implementation
          </Typography>
          <Typography paragraph>
            Implementation of multi-parameter biomarker analysis requires
            sophisticated laboratory capabilities and advanced data processing
            systems. Our platform integrates seamlessly with existing laboratory
            information systems, providing real-time analysis and interpretation
            of complex biomarker panels.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Future Directions
          </Typography>
          <Typography paragraph>
            Research continues into novel biomarkers, including microRNAs,
            proteomic signatures, and metabolomic profiles. These emerging
            technologies promise even greater diagnostic precision and may
            enable non-invasive monitoring of treatment response and disease
            progression.
          </Typography>
          <Typography paragraph>
            The integration of artificial intelligence with biomarker analysis
            represents the next frontier in hepatitis C diagnosis, offering the
            potential for truly personalized medicine approaches.
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "success.light", color: "white" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Biotech sx={{ mr: 1 }} />
              <Typography variant="h6">Diagnostic Revolution</Typography>
            </Box>
            <Typography>
              Multi-parameter biomarker analysis is revolutionizing hepatitis C
              diagnosis, providing unprecedented accuracy and enabling
              personalized treatment strategies for better patient outcomes.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default BiomarkerAnalysis;
