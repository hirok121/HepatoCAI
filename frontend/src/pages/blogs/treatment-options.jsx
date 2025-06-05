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
        "Rest, hydration, and a healthy diet help the body recover from hepatitis A. Most people recover fully without medication.",
      icon: <LocalHospital color="primary" />,
    },
    {
      type: "Hepatitis B",
      approach: "Antiviral Therapy",
      description:
        "Chronic hepatitis B may require antiviral medicines to control the virus and protect the liver. Regular monitoring is important.",
      icon: <Science color="primary" />,
    },
    {
      type: "Hepatitis C",
      approach: "Direct-Acting Antivirals",
      description:
        "Modern medications can cure hepatitis C in most cases, often with few side effects.",
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
        </Button>
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
              Explore the latest approaches for managing hepatitis.
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Modern Hepatitis Treatment
          </Typography>
          <Typography paragraph>
            Hepatitis treatment depends on the type and stage of infection.
            Advances in medicine have made it possible to cure or control most
            forms of hepatitis, improving quality of life for many patients.
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
            DAAs are a major breakthrough for hepatitis C. These medicines
            target the virus directly, leading to high cure rates in a short
            period. Most people experience few side effects.
          </Typography>
          <Typography paragraph>Examples of DAA treatments:</Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Sofosbuvir/Velpatasvir
            <br />• Glecaprevir/Pibrentasvir
            <br />• Sofosbuvir/Velpatasvir/Voxilaprevir
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Treatment Duration
          </Typography>
          <Typography paragraph>
            Most hepatitis C treatments last 8-12 weeks. Older therapies took
            much longer and had more side effects. Today, most people can
            complete treatment quickly and return to normal activities.
          </Typography>
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
              Ongoing monitoring ensures safe and effective treatment
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
              Learn more about hepatitis treatment options in this video
            </Typography>
          </Box>
          <Typography paragraph>
            Regular checkups during and after treatment help track progress and
            catch any issues early. Tests may include:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Blood tests for viral load
            <br />• Liver function tests
            <br />• Checking for side effects
            <br />• Post-treatment follow-up
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "info.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treatment Success
            </Typography>
            <Typography>
              With new therapies, hepatitis C can often be cured. Early
              diagnosis and treatment are key to preventing complications and
              living well.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default TreatmentOptions;
