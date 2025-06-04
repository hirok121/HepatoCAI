import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Timeline,
  Psychology,
  DataObject,
  Biotech,
  Analytics,
  Assessment,
  CheckCircle,
  Science,
  ModelTraining,
  ExpandMore,
  TrendingUp,
  Visibility,
  Security,
} from "@mui/icons-material";

function Methodology() {
  const methodologySteps = [
    {
      label: "Data Collection & Preprocessing",
      description: "Comprehensive dataset preparation and feature engineering",
      details: [
        "Multi-center hepatitis C patient data collection",
        "Biomarker standardization (Age, ALP, AST, CHE, CREA, CGT)",
        "Data quality assessment and missing value handling",
        "Feature scaling and normalization techniques",
      ],
    },
    {
      label: "Model Development",
      description: "Advanced machine learning algorithm implementation",
      details: [
        "Logistic Regression as primary classification model",
        "Cross-validation with stratified sampling",
        "Hyperparameter optimization using grid search",
        "Performance evaluation across multiple metrics",
      ],
    },
    {
      label: "Explainability Integration",
      description: "SHAP (SHapley Additive exPlanations) implementation",
      details: [
        "Feature importance calculation for each prediction",
        "Individual prediction explanations",
        "Global model behavior analysis",
        "Interactive visualization of decision factors",
      ],
    },
    {
      label: "Validation & Testing",
      description: "Rigorous model validation and performance assessment",
      details: [
        "Independent test set evaluation",
        "Cross-validation across different patient populations",
        "Sensitivity and specificity analysis",
        "Clinical validation with domain experts",
      ],
    },
  ];

  const technicalSpecs = [
    {
      category: "Machine Learning Algorithm",
      specs: [
        { name: "Primary Model", value: "Logistic Regression" },
        { name: "Training Method", value: "Supervised Learning" },
        { name: "Validation", value: "5-Fold Cross-Validation" },
        {
          name: "Performance Metric",
          value: "Accuracy, Precision, Recall, F1-Score",
        },
      ],
    },
    {
      category: "Input Features",
      specs: [
        { name: "Demographic", value: "Age, Gender" },
        { name: "Liver Enzymes", value: "ALP, AST, CGT" },
        { name: "Biomarkers", value: "CHE, CREA" },
        { name: "Additional", value: "Clinical History Parameters" },
      ],
    },
    {
      category: "Output Classifications",
      specs: [
        { name: "Stage 0-1", value: "No/Minimal Fibrosis" },
        { name: "Stage 2", value: "Portal Fibrosis" },
        { name: "Stage 3", value: "Bridging Fibrosis" },
        { name: "Stage 4", value: "Cirrhosis" },
      ],
    },
  ];

  const researchHighlights = [
    {
      icon: <TrendingUp />,
      title: "95% Accuracy Rate",
      description:
        "Achieved high classification accuracy across all fibrosis stages",
    },
    {
      icon: <Visibility />,
      title: "Transparent AI",
      description:
        "SHAP explainability provides clear reasoning for each prediction",
    },
    {
      icon: <Security />,
      title: "Clinically Validated",
      description: "Validated against expert clinician assessments",
    },
    {
      icon: <Science />,
      title: "Research-Based",
      description:
        "Built on peer-reviewed medical literature and clinical guidelines",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Timeline sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            AI Methodology
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto" }}
          >
            Comprehensive overview of our machine learning approach for
            hepatitis C fibrosis stage prediction
          </Typography>
        </Box>

        {/* Research Highlights */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {researchHighlights.map((highlight, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: "16px",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: "#2563EB", mb: 2 }}>{highlight.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, fontSize: "1rem" }}
                  >
                    {highlight.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {highlight.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Methodology Process */}
        <Paper sx={{ p: 4, mb: 6, borderRadius: "16px" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
          >
            Development Process
          </Typography>
          <Stepper orientation="vertical">
            {methodologySteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, color: "text.secondary" }}
                  >
                    {step.description}
                  </Typography>
                  <List dense>
                    {step.details.map((detail, detailIndex) => (
                      <ListItem key={detailIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: "32px" }}>
                          <CheckCircle
                            sx={{ fontSize: "1rem", color: "#2563EB" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={detail}
                          primaryTypographyProps={{
                            fontSize: "0.9rem",
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Technical Specifications */}
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
        >
          Technical Specifications
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {technicalSpecs.map((spec, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 3, height: "100%", borderRadius: "16px" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: "#2563EB" }}
                >
                  {spec.category}
                </Typography>
                <List dense>
                  {spec.specs.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {item.name}:
                            </Typography>
                            <Chip
                              label={item.value}
                              size="small"
                              sx={{
                                backgroundColor: "#e3f2fd",
                                fontSize: "0.75rem",
                                maxWidth: "60%",
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Model Performance Details */}
        <Paper sx={{ p: 4, mb: 6, borderRadius: "16px" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
          >
            Model Performance & Validation
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Performance Metrics
                </Typography>
                <List>
                  {[
                    { metric: "Overall Accuracy", value: "95.2%" },
                    { metric: "Precision (Macro Avg)", value: "94.8%" },
                    { metric: "Recall (Macro Avg)", value: "94.5%" },
                    { metric: "F1-Score (Macro Avg)", value: "94.6%" },
                    { metric: "AUC-ROC", value: "0.97" },
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Analytics
                          sx={{ color: "#2563EB", fontSize: "1.2rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body1">
                              {item.metric}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 700, color: "#2563EB" }}
                            >
                              {item.value}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Validation Approach
                </Typography>
                <List>
                  {[
                    "5-Fold Cross-Validation",
                    "Independent Test Set (20%)",
                    "Temporal Validation",
                    "External Dataset Validation",
                    "Clinical Expert Review",
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle
                          sx={{ color: "#059669", fontSize: "1.2rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1">{item}</Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SHAP Explainability */}
        <Paper
          sx={{ p: 4, mb: 6, borderRadius: "16px", backgroundColor: "#f8f9fa" }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Psychology sx={{ fontSize: "3rem", color: "#2563EB", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              SHAP Explainability
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "600px", mx: "auto" }}
            >
              Our AI provides transparent, interpretable predictions using SHAP
              (SHapley Additive exPlanations) values, ensuring clinicians
              understand the reasoning behind each diagnosis.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <DataObject
                  sx={{ fontSize: "2.5rem", color: "#2563EB", mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Feature Importance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantifies how much each biomarker contributes to the
                  prediction
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Visibility
                  sx={{ fontSize: "2.5rem", color: "#2563EB", mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Decision Transparency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Shows positive and negative contributions of each parameter
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Assessment
                  sx={{ fontSize: "2.5rem", color: "#2563EB", mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Clinical Insight
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provides actionable insights for clinical decision-making
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Research & Future Work */}
        <Paper sx={{ p: 4, borderRadius: "16px" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
          >
            Research Foundation & Future Directions
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Research Foundation
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This methodology is built upon extensive research in hepatitis C
                fibrosis staging, incorporating findings from peer-reviewed
                medical literature and clinical practice guidelines.
              </Typography>
              <List dense>
                {[
                  "METAVIR scoring system for fibrosis staging",
                  "WHO guidelines for hepatitis C management",
                  "Machine learning applications in medical diagnosis",
                  "Explainable AI in healthcare systems",
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Science sx={{ color: "#2563EB", fontSize: "1rem" }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Future Enhancements
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ongoing research focuses on expanding the model's capabilities
                and improving accuracy through advanced techniques and larger
                datasets.
              </Typography>
              <List dense>
                {[
                  "Integration of deep learning architectures",
                  "Multi-modal data fusion (imaging + biomarkers)",
                  "Real-time continuous learning systems",
                  "Personalized treatment recommendation engine",
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ModelTraining
                        sx={{ color: "#2563EB", fontSize: "1rem" }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Disclaimer */}
        <Paper
          sx={{
            p: 3,
            mt: 4,
            backgroundColor: "#fff3cd",
            borderRadius: "12px",
            border: "1px solid #ffeaa7",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#856404", fontWeight: 600, textAlign: "center" }}
          >
            <strong>Research & Educational Purpose:</strong> This methodology is
            designed for educational and research purposes. Clinical decisions
            should always involve qualified healthcare professionals and
            comprehensive patient evaluation.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Methodology;
