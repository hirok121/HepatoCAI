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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack,
  Article,
  FitnessCenter,
  Psychology,
  Schedule,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";

function LivingWithHepatitis() {
  const navigate = useNavigate();

  const lifestyleTips = [
    {
      title: "Regular Exercise",
      description:
        "Maintain physical activity to boost immune system and overall health",
      icon: <FitnessCenter color="primary" />,
    },
    {
      title: "Mental Health",
      description: "Manage stress and seek support when needed",
      icon: <Psychology color="primary" />,
    },
    {
      title: "Regular Check-ups",
      description: "Follow up with healthcare providers consistently",
      icon: <Schedule color="primary" />,
    },
    {
      title: "Heart Health",
      description: "Monitor cardiovascular health as part of overall wellness",
      icon: <Favorite color="primary" />,
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
            image="/api/placeholder/800/300"
            alt="Living with Hepatitis"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Article sx={{ mr: 1, color: "primary.main" }} />
              <Chip label="Article" color="primary" variant="outlined" />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Living with Hepatitis
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Lifestyle tips for hepatitis patients
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Maintaining Quality of Life
          </Typography>
          <Typography paragraph>
            A hepatitis diagnosis doesn't mean your life has to change
            dramatically. With proper management and lifestyle adjustments, many
            people with hepatitis live full, healthy lives.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Key Lifestyle Areas
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {lifestyleTips.map((tip, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {tip.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {tip.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{tip.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Daily Life Management
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Energy Management"
                secondary="Plan activities around energy levels and rest when needed"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Work Life"
                secondary="Communicate with employers about any accommodations needed"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Social Relationships"
                secondary="Educate family and friends about hepatitis to reduce stigma"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Travel Considerations"
                secondary="Plan ahead for medications and healthcare access when traveling"
              />
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Avoiding Liver Damage
          </Typography>
          <Typography paragraph>
            Protecting your liver is crucial when living with hepatitis:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Avoid alcohol completely
            <br />
            • Be cautious with medications and supplements
            <br />
            • Avoid exposure to toxins and chemicals
            <br />
            • Get vaccinated against hepatitis A and B if not already immune
            <br />• Practice safe behaviors to avoid reinfection
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Building Support Networks
          </Typography>
          <Typography paragraph>
            Having strong support systems is essential:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Join hepatitis support groups
            <br />
            • Connect with online communities
            <br />
            • Work with healthcare teams
            <br />
            • Involve family and friends in your care
            <br />• Consider counseling if needed
          </Typography>

          {/* YouTube Video Section */}
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Living with Hepatitis: Personal Stories and Guidance
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
                src="https://www.youtube.com/embed/ax17VA_0BrE"
                title="Living with Hepatitis: Personal Stories and Guidance"
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
              Inspirational stories and practical advice for living well with
              hepatitis
            </Typography>
          </Box>
        </Box>

        <Card sx={{ bgcolor: "warning.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Living Well
            </Typography>
            <Typography>
              Remember that hepatitis is just one part of your health story.
              With proper management, most people with hepatitis can live
              normal, productive lives.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default LivingWithHepatitis;
