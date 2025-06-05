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
  Avatar,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Psychology,
  AccessTime,
  Category,
  Analytics,
  Timeline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import virusImg from "../../assets/blogimages/virus2.jpg";
import virusHuman3Img from "../../assets/blogimages/virushuman3.jpg";

function MachineLearningLiverDisease() {
  const navigate = useNavigate();

  const mlFeatures = [
    {
      title: "Logistic Regression",
      description:
        "Statistical model for binary classification of fibrosis stages",
      icon: <Analytics color="primary" />,
    },
    {
      title: "SHAP Analysis",
      description:
        "Explainable AI providing insights into model decision-making",
      icon: <Timeline color="primary" />,
    },
    {
      title: "Predictive Analytics",
      description: "Forecasting disease progression and treatment outcomes",
      icon: <Psychology color="primary" />,
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
        </Button>{" "}
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={virusImg}
            alt="Machine Learning in Liver Disease"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Psychology sx={{ mr: 1, color: "primary.main" }} />
              <Chip
                label="AI Technology"
                color="secondary"
                variant="outlined"
                icon={<Category />}
              />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Machine Learning in Liver Disease: Predictive Analytics
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              How logistic regression and SHAP explainability are
              revolutionizing hepatitis C fibrosis stage prediction in clinical
              practice.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <Avatar sx={{ mr: 2 }}>MC</Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  Dr. Michael Chen
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <AccessTime
                    sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    May 18, 2025 • 7 min read
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            The Power of Predictive Analytics
          </Typography>
          <Typography paragraph>
            Machine learning has transformed how we approach liver disease
            diagnosis and prognosis. By leveraging advanced algorithms and
            explainable AI techniques, clinicians can now predict fibrosis
            stages with unprecedented accuracy, enabling more personalized
            treatment approaches.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Key Machine Learning Components
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {mlFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                  {feature.icon}
                  <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Logistic Regression in Hepatitis C
          </Typography>
          <Typography paragraph>
            Logistic regression serves as the foundation for fibrosis stage
            prediction in our AI models. This statistical approach analyzes the
            relationship between multiple biomarkers and disease outcomes,
            providing probabilistic assessments of fibrosis severity.
          </Typography>
          <Paper sx={{ p: 3, my: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom color="primary">
              Model Input Variables
            </Typography>
            <Typography component="div">
              • <strong>Laboratory Values:</strong> ALT, AST, Bilirubin,
              Platelet Count
              <br />• <strong>Patient Demographics:</strong> Age, Gender, BMI
              <br />• <strong>Clinical History:</strong> Duration of infection,
              comorbidities
              <br />• <strong>Imaging Data:</strong> Ultrasound and elastography
              results
              <br />• <strong>Genetic Factors:</strong> IL28B polymorphisms,
              fibrosis susceptibility genes
            </Typography>
          </Paper>{" "}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            SHAP Explainability
          </Typography>
          <Box sx={{ my: 3, textAlign: "center" }}>
            <CardMedia
              component="img"
              height="300"
              image={virusHuman3Img}
              alt="AI Analysis of Virus-Human Interaction"
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
              Machine learning analysis of hepatitis C virus interaction
              patterns
            </Typography>
          </Box>
          <Typography paragraph>
            SHAP (SHapley Additive exPlanations) values provide crucial insights
            into how our machine learning models make decisions. This
            explainable AI technique helps clinicians understand which factors
            contribute most significantly to predictions, building trust in
            AI-assisted diagnosis.
          </Typography>
          <Typography paragraph>
            For each patient prediction, SHAP analysis reveals:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Which biomarkers had the strongest influence on the prediction
            <br />
            • How each variable contributed positively or negatively to the
            outcome
            <br />
            • The relative importance of different risk factors
            <br />• Confidence intervals for the prediction
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Clinical Implementation
          </Typography>
          <Typography paragraph>
            Our predictive analytics platform integrates seamlessly with
            electronic health records, providing real-time risk assessments
            during patient consultations. The system generates easy-to-interpret
            visualizations that help clinicians communicate risk factors to
            patients effectively.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Validation and Performance
          </Typography>
          <Typography paragraph>
            Extensive validation studies have demonstrated that our machine
            learning models achieve over 85% accuracy in predicting fibrosis
            stages, significantly outperforming traditional scoring systems. The
            models have been tested across diverse patient populations to ensure
            generalizability and reduce bias.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Future Developments
          </Typography>
          <Typography paragraph>
            Ongoing research focuses on incorporating additional data sources,
            including genetic information, advanced imaging biomarkers, and
            longitudinal patient data to further improve prediction accuracy and
            expand the scope of predictive capabilities.
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "secondary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transforming Patient Care
            </Typography>
            <Typography>
              Machine learning and explainable AI are not just technological
              advances—they represent a fundamental shift toward more precise,
              personalized, and transparent healthcare delivery.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default MachineLearningLiverDisease;
