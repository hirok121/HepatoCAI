// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import {
  MedicalServices,
  Dataset,
  ModelTraining,
  Insights,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)(({ animationDelay = "0s" }) => ({
  animation: `${fadeInAnimation} 0.8s ease-out ${animationDelay} both`,
}));

function DiagnosisHero() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
        color: "white",
        py: { xs: 4, md: 6 },
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "90vh", md: "85vh" },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <AnimatedBox animationDelay="0s">
          <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <MedicalServices
              sx={{
                fontSize: { xs: "2.5rem", md: "3rem" },
                mb: 2,
                color: "#2563EB",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.8rem" },
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
              }}
            >
              <Box component="span" sx={{ color: "white" }}>
                Advanced HCV Stage Detection
              </Box>
              <br />
              <Box component="span" sx={{ color: "#2563EB" }}>
                Powered by AI
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.85,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              AI-powered hepatitis analysis with 96.73% accuracy using UCI ML
              dataset and advanced synthetic data generation techniques.
            </Typography>

            {/* Info Cards */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mb: 3,
                justifyContent: "center",
                alignItems: "stretch",
                maxWidth: "900px",
                mx: "auto",
              }}
            >
              <AnimatedBox
                animationDelay="0.2s"
                sx={{ flex: { xs: "1", md: "0 1 280px" } }}
              >
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(37, 99, 235, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      border: "1px solid rgba(37, 99, 235, 0.5)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        mx: "auto",
                        mb: 1.5,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Dataset sx={{ fontSize: "1.5rem", color: "white" }} />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      UCI Dataset
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      615 individuals • 4 classes
                    </Typography>
                  </CardContent>
                </Card>
              </AnimatedBox>

              <AnimatedBox
                animationDelay="0.3s"
                sx={{ flex: { xs: "1", md: "0 1 280px" } }}
              >
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.08) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      border: "1px solid rgba(139, 92, 246, 0.5)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        mx: "auto",
                        mb: 1.5,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ModelTraining
                        sx={{ fontSize: "1.5rem", color: "white" }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      ML Model
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Logistic Regression + SDV
                    </Typography>
                  </CardContent>
                </Card>
              </AnimatedBox>

              <AnimatedBox
                animationDelay="0.4s"
                sx={{ flex: { xs: "1", md: "0 1 280px" } }}
              >
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.08) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      border: "1px solid rgba(16, 185, 129, 0.5)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 2.5, px: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        mx: "auto",
                        mb: 1.5,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #10B981, #34D399)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Insights sx={{ fontSize: "1.5rem", color: "white" }} />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      96.73% Accuracy
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      ROC-AUC: 1.00
                    </Typography>
                  </CardContent>
                </Card>
              </AnimatedBox>
            </Box>

            {/* Technical Summary */}
            <AnimatedBox animationDelay="0.5s">
              <Paper
                sx={{
                  p: 2.5,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "white",
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", opacity: 0.9, lineHeight: 1.5 }}
                >
                  <strong>Dataset:</strong> 13 clinical parameters including
                  demographic data and lab biomarkers.
                  <strong> Method:</strong> SDV synthetic data generation with
                  recursive feature elimination for balanced classification.
                  <strong> Classes:</strong> Blood Donors, Hepatitis, Fibrosis,
                  Cirrhosis stages.
                </Typography>
              </Paper>
            </AnimatedBox>
          </Box>
        </AnimatedBox>
      </Container>
    </Box>
  );
}

export default DiagnosisHero;
