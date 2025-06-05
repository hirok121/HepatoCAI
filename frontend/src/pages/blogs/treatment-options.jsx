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
  Grid,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  MenuBook,
  LocalHospital,
  Science,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import image4Img from "../../assets/blogimages/image4.jpg";
import image5Img from "../../assets/blogimages/image5.jpg";

function TreatmentOptions() {
  const navigate = useNavigate();

  const treatments = [
    {
      type: "Hepatitis A",
      approach: "Supportive Care",
      description:
        "No specific treatment; focus on rest, nutrition, and symptom management",
      icon: <LocalHospital color="primary" />,
    },
    {
      type: "Hepatitis B",
      approach: "Antiviral Therapy",
      description:
        "Oral antivirals like tenofovir or entecavir for chronic cases",
      icon: <Science color="primary" />,
    },
    {
      type: "Hepatitis C",
      approach: "Direct-Acting Antivirals",
      description: "Highly effective DAAs with cure rates over 95%",
      icon: <Science color="primary" />,
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
            height="300"
            image={image4Img}
            alt="Treatment Options"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MenuBook sx={{ mr: 1, color: "primary.main" }} />
              <Chip label="Guide" color="success" variant="outlined" />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Treatment Options
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Modern treatment approaches for hepatitis management
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Modern Hepatitis Treatment
          </Typography>
          <Typography paragraph>
            Treatment for hepatitis varies significantly depending on the type
            and severity of the infection. Modern medicine has made remarkable
            advances, especially in treating hepatitis C.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Treatment by Type
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {treatments.map((treatment, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                  {treatment.icon}
                  <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                    {treatment.type}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {treatment.approach}
                  </Typography>
                  <Typography variant="body2">
                    {treatment.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Direct-Acting Antivirals (DAAs)
          </Typography>
          <Typography paragraph>
            DAAs represent a breakthrough in hepatitis C treatment. These
            medications target specific steps in the hepatitis C virus
            lifecycle, leading to sustained virologic response (cure) in over
            95% of patients.
          </Typography>
          <Typography paragraph>Common DAA regimens include:</Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Sofosbuvir/Velpatasvir (Epclusa)
            <br />
            • Glecaprevir/Pibrentasvir (Mavyret)
            <br />• Sofosbuvir/Velpatasvir/Voxilaprevir (Vosevi)
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Treatment Duration
          </Typography>
          <Typography paragraph>
            Most hepatitis C treatments now last 8-12 weeks, a significant
            improvement from older treatments that could last up to 48 weeks
            with lower cure rates and more side effects.
          </Typography>{" "}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Monitoring and Follow-up
          </Typography>
          <Box sx={{ my: 3, textAlign: "center" }}>
            <CardMedia
              component="img"
              height="280"
              image={image5Img}
              alt="Medical monitoring and follow-up care"
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
              Comprehensive monitoring and follow-up care during hepatitis
              treatment
            </Typography>
          </Box>
          {/* YouTube Video Section */}
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Understanding Hepatitis Treatment
            </Typography>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: "100%",
                mx: "auto",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/CNY_Z1q8EVk"
                title="Understanding Hepatitis Treatment"
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
              Educational video about hepatitis treatment approaches and options
            </Typography>
          </Box>
          <Typography paragraph>
            Regular monitoring during and after treatment includes:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Viral load testing
            <br />
            • Liver function tests
            <br />
            • Assessment for drug interactions
            <br />
            • Monitoring for side effects
            <br />• Post-treatment sustained virologic response testing
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "info.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treatment Success
            </Typography>
            <Typography>
              With modern treatments, hepatitis C is now considered a curable
              disease. Early detection and treatment can prevent liver damage
              and improve quality of life significantly.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default TreatmentOptions;
