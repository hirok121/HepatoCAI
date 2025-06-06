import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  Article,
  ArrowForward,
  Biotech,
  Psychology,
  Science,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Add this import for navigation
import image1 from "../../assets/blogimages/image5.jpg";
import image2 from "../../assets/blogimages/image.png";
import image3 from "../../assets/blogimages/virus2.jpg";

// Animations
const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components - Matching DiagnosticToolSection style
const StyledSection = styled(Paper)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.background.sectionDefault,
  borderRadius: 0,
  boxShadow: "none",
  background: theme.palette.background.sectionDefault,
  "@media (max-width: 600px)": {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

const AnimatedBox = styled(Box)(({ animationDelay = "0s" }) => ({
  animation: `${fadeInAnimation} 0.8s ease-out ${animationDelay} both`,
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "12px",
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

// Theme matching DiagnosticToolSection
const theme = createTheme({
  palette: {
    primary: { main: "#2563EB" },
    secondary: { main: "#4F46E5" },
    background: {
      default: "#F0F4F8",
      paper: "#FFFFFF",
      hero: "#0F172A",
      sectionAlternate: "#FFFFFF",
      sectionDefault: "#F0F4F8",
    },
    text: {
      primary: "#1E293B",
      secondary: "#475569",
      heroPrimary: "#FFFFFF",
      heroSecondary: "rgba(255, 255, 255, 0.85)",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      marginBottom: "1rem",
      color: "#1E293B",
      "@media (min-width:600px)": { fontSize: "2.75rem" },
    },
    h5: {
      fontSize: "1.125rem",
      color: "#475569",
      lineHeight: 1.7,
      "@media (min-width:600px)": { fontSize: "1.25rem" },
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#1E293B",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "#475569",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#64748B",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "none",
          transition: "background-color 0.3s ease, transform 0.2s ease",
        },
        containedPrimary: {
          color: "white",
          "&:hover": { backgroundColor: "#1D4ED8", transform: "scale(1.03)" },
        },
        outlinedPrimary: {
          borderColor: "#2563EB",
          color: "#2563EB",
          "&:hover": {
            backgroundColor: "rgba(37, 99, 235, 0.04)",
            borderColor: "#1D4ED8",
          },
        },
      },
    },
  },
});

const BlogSection = ({ id }) => {
  const navigate = useNavigate(); // Add navigation hook

  const blogPosts = [
    {
      id: 1,
      title: "Understanding Hepatitis C: From Detection to Treatment",
      excerpt:
        "Explore the latest advancements in HCV detection using AI-powered diagnostic tools and biomarker analysis for early intervention.",
      date: "May 20, 2025",
      readTime: "5 min read",
      image: image1,
      category: "Research",
      icon: <Biotech />,
      featured: true,
    },
    {
      id: 2,
      title: "Machine Learning in Liver Disease: Predictive Analytics",
      excerpt:
        "How logistic regression and SHAP explainability are revolutionizing hepatitis C fibrosis stage prediction in clinical practice.",
      date: "May 18, 2025",
      readTime: "7 min read",
      image: image2,
      category: "AI Technology",
      icon: <Psychology />,
      featured: false,
    },
    {
      id: 3,
      title: "Biomarker Analysis: The Future of HCV Diagnosis",
      excerpt:
        "Deep dive into multi-parameter analysis using liver enzymes, demographic factors, and biochemical markers for precise diagnosis.",
      date: "May 15, 2025",
      readTime: "6 min read",
      image: image3,
      category: "Clinical Science",
      icon: <Science />,
      featured: false,
    },
  ];

  // Navigation handlers
  const handleReadArticle = (post) => {
    // Navigate to specific blog post pages
    let route = "";
    switch (post.id) {
      case 1:
        route = "/blogs/understanding-hcv";
        break;
      case 2:
        route = "/blogs/machine-learning-liver-disease";
        break;
      case 3:
        route = "/blogs/biomarker-analysis";
        break;
      default:
        route = `/blogs/${post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
    }
    navigate(route);
  };

  const handleCardClick = (post) => {
    // Same navigation as read article button
    handleReadArticle(post);
  };
  const handleViewAllArticles = () => {
    // Navigate to blog listing page
    navigate("/patient-education"); // Keep this route for the general education page
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledSection
        id={id}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          mt: 0,
          pt: { xs: 4, md: 6 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <AnimatedBox animationDelay="0s">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography variant="h2" gutterBottom sx={{ mb: 2 }}>
                Latest Health{" "}
                <Box
                  component="span"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Insights
                </Box>
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  mb: 4,
                  maxWidth: "60ch",
                  mx: "auto",
                  color: "#475569",
                  fontWeight: 400,
                }}
              >
                Stay informed with cutting-edge research, AI developments, and
                clinical insights in hepatitis C detection and liver health.
              </Typography>
            </Box>
          </AnimatedBox>

          {/* Blog Posts Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
              mb: 6,
            }}
          >
            {blogPosts.map((post, index) => (
              <AnimatedBox
                key={post.id}
                animationDelay={`${0.2 + index * 0.1}s`}
              >
                <BlogCard onClick={() => handleCardClick(post)}>
                  {" "}
                  <Box
                    sx={{
                      position: "relative",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={post.image}
                      alt={post.title}
                      sx={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        objectPosition: "center",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.5, height: "calc(100% - 200px)" }}>
                    {" "}
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        mb: 1.5,
                        lineHeight: 1.4,
                        minHeight: "2.2em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.title}
                    </Typography>{" "}
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: "#64748B",
                        lineHeight: 1.6,
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                    {/* Read Article button */}
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForward />}
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleReadArticle(post);
                      }}
                      sx={{
                        mt: "auto",
                        fontSize: "0.875rem",
                      }}
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </BlogCard>
              </AnimatedBox>
            ))}
          </Box>

          {/* CTA Section */}
          <AnimatedBox animationDelay="0.6s">
            <Box
              sx={{
                textAlign: "center",
                p: 4,
                backgroundColor: "rgba(37, 99, 235, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(37, 99, 235, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#1E293B", fontWeight: 600 }}
              >
                Stay Updated with Latest Research
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "#475569" }}>
                Get insights on AI-powered medical diagnostics and hepatitis C
                research developments.
              </Typography>
              {/* Update the View All Articles button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<Article />}
                onClick={handleViewAllArticles}
                sx={{
                  minWidth: "200px",
                  fontSize: "1rem",
                }}
              >
                View All Articles
              </Button>
            </Box>
          </AnimatedBox>
        </Container>
      </StyledSection>
    </ThemeProvider>
  );
};

export default BlogSection;
