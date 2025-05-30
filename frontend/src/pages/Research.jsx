import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NavBar from "../components/layout/NavBar";

function Research() {
  const researchPapers = [
    {
      title: "AI-Driven Hepatitis Detection: A Comprehensive Study",
      authors: "Dr. Smith, Dr. Johnson, Dr. Lee",
      journal: "Journal of Medical AI",
      year: "2024",
      abstract:
        "This study explores the effectiveness of artificial intelligence in detecting hepatitis...",
      tags: ["AI", "Detection", "Machine Learning"],
    },
    {
      title: "Novel Treatment Approaches for Hepatitis C",
      authors: "Dr. Brown, Dr. Wilson",
      journal: "Hepatology Research",
      year: "2023",
      abstract:
        "Recent advances in hepatitis C treatment have shown promising results...",
      tags: ["Treatment", "Hepatitis C", "Clinical Trial"],
    },
    {
      title: "Hepatitis B Vaccination Strategies",
      authors: "Dr. Davis, Dr. Martinez",
      journal: "Preventive Medicine",
      year: "2023",
      abstract:
        "Analysis of global hepatitis B vaccination programs and their effectiveness...",
      tags: ["Vaccination", "Prevention", "Public Health"],
    },
  ];

  const ongoingStudies = [
    "Long-term effects of new hepatitis treatments",
    "AI prediction models for hepatitis progression",
    "Genetic factors in hepatitis susceptibility",
    "Community-based hepatitis prevention programs",
  ];
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LibraryBooksIcon
              sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Research Hub
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Latest research findings and ongoing studies in hepatitis care
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Research Papers */}
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Publications
              </Typography>
              {researchPapers.map((paper, index) => (
                <Paper key={index} sx={{ p: 3, mb: 3, borderRadius: "16px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {paper.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {paper.authors} • {paper.journal} • {paper.year}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {paper.abstract}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {paper.tags.map((tag, tagIndex) => (
                      <Chip key={tagIndex} label={tag} size="small" />
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    size="small"
                    sx={{
                      borderColor: "#2563EB",
                      color: "#2563EB",
                      "&:hover": {
                        backgroundColor: "#2563EB",
                        color: "white",
                      },
                    }}
                  >
                    Read Full Paper
                  </Button>
                </Paper>
              ))}
            </Grid>
            {/* Ongoing Studies */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Ongoing Studies
                </Typography>
                <List>
                  {ongoingStudies.map((study, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={study}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>{" "}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Research;
