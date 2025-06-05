import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import { Psychology, Analytics, Timeline } from "@mui/icons-material";
import NavBar from "../../components/layout/NavBar";
import virusImg from "../../assets/blogimages/virus2.jpg";
import virusHuman3Img from "../../assets/blogimages/virushuman3.jpg";

function MachineLearningLiverDisease() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={virusImg}
            alt="Machine Learning in Liver Disease"
          />
          <CardContent>
            <Typography variant="h3" component="h1" gutterBottom>
              Machine Learning in Liver Disease: Predictive Analytics
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Artificial intelligence is reshaping the landscape of liver
              disease management. By harnessing the power of machine learning,
              clinicians and researchers are uncovering new ways to diagnose,
              monitor, and treat conditions such as hepatitis C, cirrhosis, and
              fatty liver disease.
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Revolutionizing Diagnosis and Prognosis
          </Typography>
          <Typography paragraph>
            Machine learning models can analyze vast amounts of clinical,
            laboratory, and imaging data to identify subtle patterns that may be
            missed by traditional methods. These models are capable of
            predicting disease progression, identifying high-risk patients, and
            supporting early intervention strategies. For example, algorithms
            can assess liver stiffness from elastography images or predict the
            likelihood of advanced fibrosis using routine blood tests.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Ensuring Data Quality and Model Validation
          </Typography>
          <Typography paragraph>
            According to recent research, the effectiveness of AI-driven liver
            disease prediction depends heavily on the quality and diversity of
            the data used for model training. The PDF highlights that rigorous
            validation across multiple cohorts is essential to ensure that
            machine learning models are robust and generalizable in real-world
            clinical settings. This approach minimizes bias and enhances the
            reliability of AI-assisted diagnosis and prognosis.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Key Technologies in Use
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <Analytics color="primary" />
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  Deep Learning
                </Typography>
                <Typography variant="body2">
                  Neural networks process imaging and histopathology data for
                  automated feature extraction and classification.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <Timeline color="primary" />
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  Ensemble Methods
                </Typography>
                <Typography variant="body2">
                  Random forests and gradient boosting improve prediction
                  accuracy by combining multiple models.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <Psychology color="primary" />
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  Explainable AI
                </Typography>
                <Typography variant="body2">
                  SHAP and LIME provide transparency, helping clinicians
                  understand model decisions and build trust.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Data Sources and Model Inputs
          </Typography>
          <Paper sx={{ p: 3, my: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom color="primary">
              Typical Features Used
            </Typography>
            <Typography component="div">
              • <strong>Blood Markers:</strong> ALT, AST, GGT, Albumin,
              Platelets
              <br />• <strong>Imaging:</strong> Ultrasound, MRI, elastography
              <br />• <strong>Demographics:</strong> Age, sex, BMI, ethnicity
              <br />• <strong>Clinical History:</strong> Alcohol use, diabetes,
              viral status
              <br />• <strong>Genomics:</strong> Risk alleles, gene expression
              profiles
            </Typography>
          </Paper>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Visualizing AI Insights
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
              AI-driven analysis reveals complex interactions between viral
              factors and host response in liver disease.
            </Typography>
          </Box>
          <Typography paragraph>
            Modern machine learning tools not only predict outcomes but also
            provide visual explanations. Feature importance plots, risk
            heatmaps, and individualized prediction breakdowns help clinicians
            and patients understand the rationale behind each assessment.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Clinical Impact and Integration
          </Typography>
          <Typography paragraph>
            Integrating AI into clinical workflows enables real-time decision
            support. Automated alerts, risk stratification dashboards, and
            personalized care recommendations are now possible within electronic
            health record systems. These innovations support earlier diagnosis,
            targeted surveillance, and optimized treatment plans.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Challenges and Future Directions
          </Typography>
          <Typography paragraph>
            While machine learning offers tremendous promise, challenges remain.
            Ensuring data quality, addressing bias, and validating models across
            diverse populations are critical for safe deployment. Ongoing
            research is focused on federated learning, multi-omics integration,
            and continuous model updating to keep pace with evolving clinical
            knowledge.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Looking Ahead
          </Typography>
          <Typography paragraph>
            The future of liver disease care will be shaped by increasingly
            sophisticated AI systems. As models become more accurate and
            interpretable, they will empower clinicians to deliver more precise,
            proactive, and patient-centered care.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Research Highlights
          </Typography>
          <Typography paragraph>
            Recent studies demonstrate that advanced machine learning
            algorithms, including deep neural networks and ensemble approaches,
            are achieving high accuracy in detecting liver fibrosis and
            differentiating between disease stages. Integrating laboratory,
            imaging, and clinical data has been shown to significantly improve
            predictive performance. Furthermore, transparent model
            interpretation and close collaboration between clinicians and data
            scientists are essential for safe and effective adoption of AI in
            real-world hepatology practice.
          </Typography>
        </Box>
        <Card sx={{ bgcolor: "secondary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Advancing Liver Health with AI
            </Typography>
            <Typography>
              The integration of machine learning into hepatology is not just a
              technological leap—it is a new era of medicine, offering hope for
              earlier detection, better outcomes, and improved quality of life
              for patients worldwide.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default MachineLearningLiverDisease;
