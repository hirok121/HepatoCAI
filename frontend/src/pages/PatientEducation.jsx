import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DownloadIcon from "@mui/icons-material/Download";
import NavBar from "../components/layout/NavBar";

function PatientEducation() {
  const educationResources = [
    {
      title: "Understanding Hepatitis Types",
      description:
        "Learn about different types of hepatitis and their characteristics",
      type: "article",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Prevention Guidelines",
      description: "Essential steps to prevent hepatitis transmission",
      type: "video",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Treatment Options",
      description: "Modern treatment approaches for hepatitis management",
      type: "guide",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Living with Hepatitis",
      description: "Lifestyle tips for hepatitis patients",
      type: "article",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Nutrition Guide",
      description: "Dietary recommendations for hepatitis patients",
      type: "guide",
      image: "/api/placeholder/300/200",
    },
    {
      title: "FAQs About Hepatitis",
      description: "Common questions and answers about hepatitis",
      type: "video",
      image: "/api/placeholder/300/200",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <PlayCircleIcon />;
      case "guide":
        return <DownloadIcon />;
      default:
        return <ArticleIcon />;
    }
  };
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <ArticleIcon sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Patient Education
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive educational resources to help you understand and
              manage hepatitis
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {educationResources.map((resource, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: "100%", borderRadius: "16px" }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ textAlign: "center", color: "#2563EB" }}>
                      {getIcon(resource.type)}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {resource.type.toUpperCase()}
                      </Typography>
                    </Box>
                  </CardMedia>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {resource.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {resource.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={getIcon(resource.type)}
                      sx={{
                        borderColor: "#2563EB",
                        color: "#2563EB",
                        "&:hover": {
                          backgroundColor: "#2563EB",
                          color: "white",
                        },
                      }}
                    >
                      {resource.type === "video"
                        ? "Watch"
                        : resource.type === "guide"
                        ? "Download"
                        : "Read"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}{" "}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default PatientEducation;
