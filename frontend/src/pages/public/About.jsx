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

function About() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      avatar: "SJ",
    },
    {
      name: "Dr. Michael Chen",
      role: "AI Research Director",
      avatar: "MC",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Clinical Specialist",
      avatar: "ER",
    },
    {
      name: "Alex Thompson",
      role: "Lead Developer",
      avatar: "AT",
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
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <InfoIcon sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              About HepatoCAI
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "800px", mx: "auto" }}
            >
              Revolutionizing hepatitis care through artificial intelligence and
              community support
            </Typography>
          </Box>

          {/* Mission Statement */}
          <Paper
            sx={{ p: 4, mb: 6, borderRadius: "16px", textAlign: "center" }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              HepatoCAI is dedicated to improving hepatitis diagnosis,
              treatment, and patient outcomes through cutting-edge artificial
              intelligence technology. We believe that everyone deserves access
              to accurate, timely, and personalized healthcare solutions.
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
            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      borderRadius: "16px",
                      p: 2,
                    }}
                  >
                    <CardContent>
                      {value.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, my: 2 }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}
            >
              Our Team
            </Typography>
            <Grid container spacing={3}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2,
                        backgroundColor: "#2563EB",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Company Stats */}
          <Paper sx={{ p: 4, borderRadius: "16px" }}>
            <Grid container spacing={4} sx={{ textAlign: "center" }}>
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
      </Container>
    </Box>
  );
}

export default About;
