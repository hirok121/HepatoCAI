// eslint-disable-next-line no-unused-vars
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
  Chip,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DownloadIcon from "@mui/icons-material/Download";
import ScienceIcon from "@mui/icons-material/Science";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";

function PatientEducation() {
  const navigate = useNavigate();
  const educationResources = [
    {
      title:
        "Understanding Hepatitis C Virus (HCV): From Detection to Treatment",
      description:
        "Understanding HCV through advanced AI diagnostic tools and biomarker analysis",
      type: "article",
      image: "/src/assets/blogimages/hcv_symptoms.jpg",
      link: "/blogs/understanding-hcv",
      tags: ["AI", "Diagnostics", "HCV"],
    },
    {
      title: "Understanding Hepatitis Types",
      description:
        "Learn about different types of hepatitis and their characteristics",
      type: "article",
      image: "/src/assets/blogimages/virus.jpg",
      link: "/blogs/understanding-hepatitis-types",
    },
    {
      title: "Prevention Guidelines",
      description: "Essential steps to prevent hepatitis transmission",
      type: "guide",
      image: "/src/assets/blogimages/virus2.jpg",
      link: "/blogs/prevention-guidelines",
    },
    {
      title: "Treatment Options",
      description: "Modern treatment approaches for hepatitis management",
      type: "guide",
      image: "/src/assets/blogimages/image4.jpg",
      link: "/blogs/treatment-options",
    },
    {
      title: "Living with Hepatitis",
      description: "Lifestyle tips for hepatitis patients",
      type: "article",
      image: "/src/assets/blogimages/livingwithhcv.png",
      link: "/blogs/living-with-hepatitis",
    },
    {
      title: "Nutrition Guide",
      description: "Dietary recommendations for hepatitis patients",
      type: "guide",
      image: "/src/assets/blogimages/image5.jpg",
      link: "/blogs/nutrition-guide",
    },
    {
      title: "FAQs About Hepatitis",
      description: "Common questions and answers about hepatitis",
      type: "article",
      image: "/src/assets/blogimages/image2.png",
      link: "/blogs/faqs-about-hepatitis",
    },
    {
      title: "Machine Learning in Liver Disease",
      description:
        "Logistic regression models and SHAP explainability for hepatitis diagnosis",
      type: "article",
      image: "/src/assets/blogimages/image.png",
      link: "/blogs/machine-learning-liver-disease",
      tags: ["Machine Learning", "SHAP", "Explainability"],
    },
    {
      title: "Biomarker Analysis & Precision Medicine",
      description:
        "Multi-parameter analysis for precise hepatitis diagnosis and treatment",
      type: "guide",
      image: "/src/assets/blogimages/hcv_symptoms2.jpg",
      link: "/blogs/biomarker-analysis",
      tags: ["Biomarkers", "Precision Medicine", "Analysis"],
    },
  ];
  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <PlayCircleIcon />;
      case "guide":
        return <DownloadIcon />;
      case "research":
        return <ScienceIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const handleCardClick = (link) => {
    navigate(link);
  };
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        {" "}
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <ArticleIcon sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Patient Education
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: "600px", mx: "auto" }}
            >
              Comprehensive educational resources to help you understand and
              manage hepatitis with evidence-based information and AI-powered
              insights
            </Typography>
          </Box>
          {/* Introduction Section */}
          <Box
            sx={{
              mb: 6,
              p: 4,
              backgroundColor: "#f8fafc",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 2, color: "#1e40af" }}
                >
                  Why Patient Education Matters
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: "#64748b", lineHeight: 1.7 }}
                >
                  Understanding hepatitis is crucial for effective management
                  and prevention. Our educational resources combine traditional
                  medical knowledge with cutting-edge AI insights to provide you
                  with comprehensive, personalized information.
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Chip
                    label="Evidence-Based"
                    sx={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label="AI-Powered"
                    sx={{
                      backgroundColor: "#ecfdf5",
                      color: "#059669",
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label="Expert Reviewed"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#d97706",
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "white",
                      borderRadius: "12px",
                      textAlign: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: "#2563EB", mb: 1 }}
                    >
                      9+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Educational Resources
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "white",
                      borderRadius: "12px",
                      textAlign: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: "#059669", mb: 1 }}
                    >
                      3+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-Enhanced Articles
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "white",
                      borderRadius: "12px",
                      textAlign: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: "#dc2626", mb: 1 }}
                    >
                      100%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Free Access
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "white",
                      borderRadius: "12px",
                      textAlign: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: "#7c3aed", mb: 1 }}
                    >
                      24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available Access
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Education Resources Section */}
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 3, color: "#1e40af" }}
            >
              Educational Resources
            </Typography>
            <Grid container spacing={3}>
              {educationResources.map((resource, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      },
                    }}
                    onClick={() => handleCardClick(resource.link)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={resource.image}
                      alt={resource.title}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        maxHeight: "200px",
                        minHeight: "200px",
                        backgroundColor: "#f5f5f5",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      {resource.tags && (
                        <Box sx={{ mb: 2 }}>
                          {resource.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              sx={{
                                mr: 0.5,
                                mb: 0.5,
                                backgroundColor: "#ecfdf5",
                                color: "#059669",
                                fontSize: "0.75rem",
                              }}
                            />
                          ))}
                        </Box>
                      )}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(resource.link);
                        }}
                      >
                        {resource.type === "video"
                          ? "Watch"
                          : resource.type === "guide"
                          ? "Read Guide"
                          : "Read Article"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}{" "}
            </Grid>
          </Box>
          {/* Quick Tips Section */}
          <Box
            sx={{
              mt: 8,
              mb: 6,
              p: 4,
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                textAlign: "center",
                color: "#1e40af",
              }}
            >
              Quick Health Tips
            </Typography>
            <Grid container spacing={3}>
              {" "}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#f0f9ff",
                      border: "2px solid #2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">🛡️</Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "#1e40af",
                    }}
                  >
                    Prevention First
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      lineHeight: 1.5,
                    }}
                  >
                    Get vaccinated and practice safe hygiene to prevent
                    hepatitis transmission
                  </Typography>
                </Box>
              </Grid>{" "}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#ecfdf5",
                      border: "2px solid #059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">🥗</Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "#059669",
                    }}
                  >
                    Healthy Diet
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      lineHeight: 1.5,
                    }}
                  >
                    Follow a balanced diet low in fat and alcohol to support
                    liver health
                  </Typography>
                </Box>
              </Grid>{" "}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#fef3c7",
                      border: "2px solid #d97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4">🏥</Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "#d97706",
                    }}
                  >
                    Regular Checkups
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      lineHeight: 1.5,
                    }}
                  >
                    Schedule regular medical checkups for early detection and
                    monitoring
                  </Typography>
                </Box>
              </Grid>{" "}
            </Grid>
          </Box>
          {/* AI Assistant Section */}
          <Box
            sx={{
              mt: 6,
              mb: 6,
              p: 4,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "20px",
              color: "white",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.25)",
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "white",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  🤖 Chat with HepatoC AI Assistant
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    opacity: 0.95,
                    lineHeight: 1.6,
                    fontSize: "1.1rem",
                  }}
                >
                  Get instant answers to your hepatitis questions with our
                  AI-powered assistant. Available 24/7 to provide personalized
                  guidance, explain medical terms, and help you understand your
                  health better.
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                  <Chip
                    label="Instant Responses"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                  <Chip
                    label="Medical Expertise"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                  <Chip
                    label="Personalized"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: "#059669",
                    px: 4,
                    py: 2,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/ai-assistant")}
                >
                  💬 Start Chat
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    opacity: 0.8,
                    fontStyle: "italic",
                  }}
                >
                  Free • No registration required
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {/* Call to Action Section */}
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 4,
              backgroundColor: "white",
              borderRadius: "16px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 2, color: "#1e40af" }}
            >
              Need Personalized Healthcare?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: "500px", mx: "auto" }}
            >
              Get AI-powered diagnostic insights and personalized
              recommendations for your hepatitis management
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#2563EB",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
              onClick={() => navigate("/diagnosis")}
            >
              Start AI Diagnosis
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default PatientEducation;
