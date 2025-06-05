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
        </Button>{" "}
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
              Essential steps to prevent hepatitis transmission
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            General Prevention Strategies
          </Typography>
          <Typography paragraph>
            Preventing hepatitis involves understanding transmission routes and
            taking appropriate precautions. Here are the most effective
            prevention strategies for different types of hepatitis.
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
                secondary="Highly effective, recommended for travelers and high-risk individuals"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Hepatitis B Vaccine"
                secondary="Part of routine childhood immunizations, also recommended for adults at risk"
              />
            </ListItem>
          </List>{" "}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Safe Practices
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
              Essential safety practices for hepatitis prevention
            </Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Safe Food and Water"
                secondary="Avoid contaminated food and water, especially when traveling"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Safe Sex Practices"
                secondary="Use protection and get tested regularly with partners"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Avoid Sharing Personal Items"
                secondary="Never share needles, razors, toothbrushes, or other personal items"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Blood Safety"
                secondary="Ensure blood transfusions and medical procedures use sterile equipment"
              />
            </ListItem>
          </List>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            High-Risk Groups
          </Typography>
          <Typography paragraph>
            Certain groups should take extra precautions:
          </Typography>
          <Typography component="div">
            • Healthcare workers
            <br />
            • People with multiple sexual partners
            <br />
            • Injection drug users
            <br />
            • Travelers to endemic areas
            <br />
            • People with chronic liver disease
            <br />• Household contacts of infected individuals
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "success.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Remember
            </Typography>
            <Typography>
              Prevention is always better than treatment. Regular testing and
              following these guidelines can significantly reduce your risk of
              hepatitis infection.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default PreventionGuidelines;
