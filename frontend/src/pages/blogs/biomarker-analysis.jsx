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
      description: "Enzyme that signals liver cell injury or inflammation.",
    },
    {
      name: "AST (Aspartate Aminotransferase)",
      description:
        "Another enzyme that, when elevated, may indicate liver or muscle issues.",
    },
    {
      name: "Bilirubin",
      description:
        "A pigment that, when high, suggests liver processing problems.",
    },
    {
      name: "Platelet Count",
      description: "Low levels can be a sign of advanced liver disease.",
    },
    {
      name: "Albumin",
      description:
        "A protein made by the liver; low levels may reflect poor liver function.",
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
        </Button>
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
              Discover how modern biomarker analysis is transforming hepatitis C
              diagnosis.
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Understanding Biomarkers
          </Typography>
          <Typography paragraph>
            Biomarkers are measurable indicators in the body that help doctors
            assess liver health and detect hepatitis C. By analyzing several
            markers together, healthcare professionals can get a clearer picture
            of disease stage and treatment needs.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Key Biomarkers for Hepatitis C
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
            Why Multi-Parameter Analysis?
          </Typography>
          <Typography paragraph>
            Looking at several biomarkers at once allows for more accurate
            diagnosis and monitoring. This approach considers not just liver
            enzymes, but also blood counts, proteins, and patient background,
            leading to better care.
          </Typography>
          <Paper sx={{ p: 3, my: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom color="primary">
              What is Included in Analysis?
            </Typography>
            <Typography component="div">
              <strong>Lab Tests:</strong>
              <br />• Liver enzymes (ALT, AST, GGT)
              <br />• Bilirubin levels
              <br />• Proteins (albumin, globulin)
              <br />• Blood clotting tests
              <br />• Blood cell counts
              <br />
              <br />
              <strong>Patient Factors:</strong>
              <br />• Age, gender, and body weight
              <br />• Medical history and other conditions
              <br />• Previous treatments
            </Typography>
          </Paper>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Benefits of This Approach
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
              Laboratory testing helps guide hepatitis C care
            </Typography>
          </Box>
          <Typography paragraph>
            Using multiple biomarkers helps detect hepatitis C earlier, tailor
            treatment, and monitor progress more effectively. It also reduces
            the risk of misdiagnosis.
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Early detection of liver problems
            <br />• More precise treatment plans
            <br />• Better tracking of recovery
            <br />• Fewer unnecessary treatments
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            New Developments
          </Typography>
          <Typography paragraph>
            Researchers are finding new biomarkers that may further improve
            diagnosis and monitoring. These include markers for liver scarring
            and inflammation, as well as genetic and protein-based indicators.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Looking Ahead
          </Typography>
          <Typography paragraph>
            As technology advances, biomarker analysis will become even more
            accurate and accessible, helping more people get the right care at
            the right time.
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "success.light", color: "white" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Biotech sx={{ mr: 1 }} />
              <Typography variant="h6">Diagnostic Progress</Typography>
            </Box>
            <Typography>
              Multi-parameter biomarker analysis is changing how hepatitis C is
              diagnosed and managed, leading to better outcomes for patients.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default BiomarkerAnalysis;
