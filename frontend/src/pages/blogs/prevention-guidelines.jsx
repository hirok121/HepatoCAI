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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowBack,
  PlayCircle,
  Shield,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import image2Img from "../../assets/blogimages/image2.png";
import imageImg from "../../assets/blogimages/image.png";

function PreventionGuidelines() {
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
        </Button>
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="300"
            image={image2Img}
            alt="Prevention Guidelines"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PlayCircle sx={{ mr: 1, color: "primary.main" }} />
              <Chip label="Video" color="secondary" variant="outlined" />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Prevention Guidelines
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Learn how to protect yourself and others from hepatitis.
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            How to Prevent Hepatitis
          </Typography>
          <Typography paragraph>
            Preventing hepatitis starts with understanding how it spreads.
            Simple steps can greatly reduce your risk and help keep your
            community safe.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Vaccination
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Hepatitis A Vaccine"
                secondary="Recommended for children, travelers, and those at higher risk."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Hepatitis B Vaccine"
                secondary="Part of routine immunizations and important for adults at risk."
              />
            </ListItem>
          </List>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Safe Habits
          </Typography>
          <Box sx={{ my: 3, textAlign: "center" }}>
            <CardMedia
              component="img"
              height="250"
              image={imageImg}
              alt="Hepatitis prevention and safety measures"
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
              Good hygiene and safe practices help prevent hepatitis
            </Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Clean Food and Water"
                secondary="Drink safe water and eat well-cooked food, especially when traveling."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Safe Sex"
                secondary="Use protection and get tested regularly."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Don't Share Personal Items"
                secondary="Avoid sharing needles, razors, or toothbrushes."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Medical Safety"
                secondary="Ensure sterile equipment is used for medical and dental care."
              />
            </ListItem>
          </List>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Who Needs Extra Care?
          </Typography>
          <Typography paragraph>
            Some people are at higher risk and should be especially careful:
          </Typography>
          <Typography component="div">
            • Healthcare workers
            <br />• People with multiple partners
            <br />• Injection drug users
            <br />• Travelers to certain countries
            <br />• People with chronic liver disease
            <br />• Family members of those with hepatitis
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "success.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stay Protected
            </Typography>
            <Typography>
              Prevention is the best defense. Stay informed, get vaccinated, and
              practice safe habits to lower your risk of hepatitis.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreventionGuidelines;
