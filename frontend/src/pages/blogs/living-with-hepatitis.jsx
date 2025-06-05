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
      title: "Stay Active",
      description:
        "Regular movement helps boost energy and supports your immune system.",
      icon: <FitnessCenter color="primary" />,
    },
    {
      title: "Care for Your Mind",
      description:
        "Managing stress and seeking support can improve well-being.",
      icon: <Psychology color="primary" />,
    },
    {
      title: "Routine Checkups",
      description: "Keep up with medical appointments to monitor your health.",
      icon: <Schedule color="primary" />,
    },
    {
      title: "Heart Health",
      description: "A healthy heart supports your overall wellness.",
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
              Practical advice for managing hepatitis in daily life.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Living Well with Hepatitis
          </Typography>
          <Typography paragraph>
            A hepatitis diagnosis can be managed with healthy habits and
            support. Many people continue to enjoy active, fulfilling lives by
            making a few adjustments.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Healthy Habits
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
            Everyday Tips
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Balance Your Energy"
                secondary="Plan your day to include rest and activity."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Work and School"
                secondary="Talk to your employer or teachers if you need adjustments."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Relationships"
                secondary="Share information with loved ones to build understanding."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Travel Planning"
                secondary="Prepare ahead for medications and care when away from home."
              />
            </ListItem>
          </List>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Protecting Your Liver
          </Typography>
          <Typography paragraph>
            Take steps to keep your liver healthy:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Avoid alcohol
            <br />• Use medicines and supplements only as directed
            <br />• Stay away from harmful chemicals
            <br />• Get vaccinated for hepatitis A and B if needed
            <br />• Practice safe habits to prevent reinfection
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Building Support
          </Typography>
          <Typography paragraph>
            Support from others can make a big difference:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Join support groups
            <br />• Connect online
            <br />• Work with your healthcare team
            <br />• Involve family and friends
            <br />• Seek counseling if you need it
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
              Hear from others and get tips for living well with hepatitis
            </Typography>
          </Box>
        </Box>

        <Card sx={{ bgcolor: "warning.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Living Well
            </Typography>
            <Typography>
              Hepatitis is only one part of your life. With the right care and
              support, you can continue to thrive.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default LivingWithHepatitis;
