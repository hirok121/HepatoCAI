import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import NavBar from "../../components/layout/NavBar";
import me from "../../assets/me.jpg";

function About() {
  const teamMembers = [
    {
      name: "MD Hirok Reza",
      role: "AI Enthusiast",
      avatar: (
        <Avatar
          src={me}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            backgroundColor: "#2563EB",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        />
      ),
      description: (
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontWeight: 600 }}
          >
            Institution: Student of Computer Science and Engineering,
            <br />
            Rajshahi University of Engineering & Technology (RUET)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            🚀 Passionate about building intelligent systems that make a
            difference, I’m a driven Computer Science student at RUET with a
            strong foundation in both software engineering and AI research. I
            specialize in designing and deploying scalable web and AI solutions
            using modern technologies.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontWeight: 600 }}
          >
            💡 Key Skills:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <b>Programming & Frameworks:</b> Python, Django, React
            <br />
            <b>DevOps Tools:</b> Git, Docker
            <br />
            <b>AI & ML:</b> Machine Learning, Deep Learning, Data Preprocessing,
            Model Optimization
            <br />
            <b>Additional Interests:</b> Open-source development, backend
            architecture, and cloud deployment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            🧠 Whether it’s developing smart applications or exploring deep
            learning models, I’m always up for challenges that push my limits
            and grow my expertise in AI and full-stack development.
          </Typography>
        </>
      ),
    },
  ];

  const values = [
    {
      icon: <SecurityIcon sx={{ fontSize: "3rem", color: "#2563EB" }} />,
      title: "Privacy & Security",
      description:
        "Your health data is protected with enterprise-grade security and privacy measures.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: "3rem", color: "#2563EB" }} />,
      title: "Continuous Innovation",
      description:
        "We continuously improve our AI models with the latest research and medical advances.",
    },
    {
      icon: <GroupIcon sx={{ fontSize: "3rem", color: "#2563EB" }} />,
      title: "Community-Focused",
      description:
        "Building a supportive community for patients, caregivers, and healthcare professionals.",
    },
  ];
  return (
    <Box sx={{ backgroundColor: "#f4f6fb", minHeight: "100vh" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 } }}>
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <InfoIcon sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}
            >
              About HepatoCAI
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                mb: 2,
                lineHeight: 1.7,
              }}
            >
              Empowering hepatitis care with advanced AI, HepatoCAI delivers
              innovative solutions for diagnosis, treatment, and patient
              support. Our platform bridges technology and healthcare, making
              expert guidance accessible to all.
            </Typography>
          </Box>

          {/* Mission Statement */}
          <Paper
            sx={{
              p: { xs: 3, md: 6 },
              mb: 6,
              borderRadius: "24px",
              textAlign: "center",
              backgroundColor: "#f0f4ff",
              boxShadow: 3,
              border: "1px solid #e0e7ef",
              transition: "box-shadow 0.2s, transform 0.2s",
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-4px) scale(1.02)",
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                letterSpacing: 0.5,
                color: "#2563EB",
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.15rem",
                lineHeight: 1.8,
                maxWidth: "800px",
                mx: "auto",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              To transform hepatitis management by harnessing artificial
              intelligence, ensuring every patient receives accurate, timely,
              and personalized care. We strive to close healthcare gaps and
              improve outcomes for communities worldwide.
            </Typography>
          </Paper>

          {/* Values */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}
            >
              Our Values
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <Card
                sx={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: "16px",
                  p: 2,
                  backgroundColor: "#f8fafc",
                  boxShadow: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px) scale(1.03)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SecurityIcon sx={{ fontSize: "3rem", color: "#2563EB" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, my: 2 }}>
                    Privacy & Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We safeguard your health data with robust, industry-leading
                    protections.
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: "16px",
                  p: 2,
                  backgroundColor: "#f8fafc",
                  boxShadow: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px) scale(1.03)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: "3rem", color: "#2563EB" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, my: 2 }}>
                    Continuous Innovation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our AI evolves with the latest research, driving better
                    results for patients and providers.
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: "16px",
                  p: 2,
                  backgroundColor: "#f8fafc",
                  boxShadow: 2,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px) scale(1.03)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GroupIcon sx={{ fontSize: "3rem", color: "#2563EB" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, my: 2 }}>
                    Community-Focused
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We foster a supportive network for patients, caregivers, and
                    healthcare professionals, building trust and collaboration.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Team Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: "center",
                mb: 4,
                letterSpacing: 0.5,
              }}
            >
              Our Team
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={8} md={6} key={index}>
                  <Box
                    sx={{
                      textAlign: "center",
                      backgroundColor: "#f8fafc",
                      borderRadius: "16px",
                      p: 3,
                      boxShadow: 2,
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px) scale(1.03)",
                      },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {member.avatar}
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                    {member.description}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Company Stats */}
          <Box sx={{ position: "relative", mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 8,
                right: 16,
                color: "text.secondary",
                fontStyle: "italic",
                zIndex: 1,
              }}
            >
              *Data shown are dummy
            </Typography>
            <Paper
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: "16px",
                backgroundColor: "#fff",
                boxShadow: 1,
              }}
            >
              <Grid
                container
                spacing={4}
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#2563EB" }}
                  >
                    10K+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Patients Helped
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#2563EB" }}
                  >
                    95%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Accuracy Rate
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#2563EB" }}
                  >
                    24/7
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    AI Support
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#2563EB" }}
                  >
                    50+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Research Papers
                  </Typography>
                </Grid>
              </Grid>{" "}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default About;
