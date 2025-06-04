// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  LinearProgress,
  Chip,
  Paper,
  Container,
} from "@mui/material";
import { Psychology, Assessment } from "@mui/icons-material";
import HcvStatusRiskStage from "./HcvStatusRiskStage";
import PatientInfo from "./PatientInfo";
import HCVAnalysis from "./HCVAnalysisCompact";
import FeatureImportance from "./FeatureImportance";

function DiagnosisResults({ results, loading }) {
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Psychology
              sx={{
                fontSize: "4rem",
                mb: 2,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { transform: "scale(1)", opacity: 1 },
                  "50%": { transform: "scale(1.05)", opacity: 0.8 },
                },
              }}
            />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              AI Analysis in Progress
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Our advanced machine learning algorithms are analyzing your
              hepatitis data
            </Typography>
            <LinearProgress
              sx={{
                borderRadius: 1,
                height: 8,
                backgroundColor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "rgba(255,255,255,0.8)",
                },
              }}
            />
          </Box>
        </Card>
      </Container>
    );
  }
  if (!results) return null;

  // Extract data from results - handle both nested and direct structure
  const diagnosisData = results.patient.hcv_result;
  const hcvProbability = diagnosisData.hcv_status_probability || 0;
  const confidence = diagnosisData.confidence || 0;
  const stagePredictions = diagnosisData.hcv_stage_probability;
  const featureImportance = results.feature_importance || {};

  const recommendation =
    diagnosisData.recommendation || "No recommendation provided";

  // Extract HCV status, risk, and stage for new components
  const hcvStatus = diagnosisData.hcv_status;
  const hcvRisk = diagnosisData.hcv_risk;
  const hcvStage = diagnosisData.hcv_stage;
  const getProbabilityColor = (prob, risk) => {
    // Use risk-based colors if risk is provided
    if (risk) {
      switch (risk.toLowerCase()) {
        case "high":
          return "#EF4444"; // Red for high risk
        case "medium":
          return "#F59E0B"; // Orange for medium risk
        case "moderate":
          return "#F59E0B"; // Orange for medium/moderate risk
        case "low":
          return "#10B981"; // Green for low risk
        default:
          break;
      }
    }
    // Fallback to probability-based colors
    if (prob > 0.7) return "#EF4444";
    if (prob > 0.4) return "#F59E0B";
    return "#10B981";
  };
  const getStageColor = (stage) => {
    const colors = {
      "Blood Donors": "#10B981",
      Hepatitis: "#F59E0B",
      Fibrosis: "#EF4444",
      Cirrhosis: "#DC2626",
    };
    return colors[stage] || "#6B7280";
  };
  return (
    <Container sx={{ py: 2, height: "130vh" }}>
      {/* Compact Header Section */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          mb: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Assessment sx={{ fontSize: "1.8rem" }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                HCV Diagnosis Results
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI-Powered Hepatitis C Analysis
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${(confidence * 100).toFixed(1)}% Confidence`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
              padding: "4px 12px",
            }}
          />
        </Box>
      </Paper>

      {/* Optimized Grid Layout for One Screen */}
      <Box
        sx={{
          flex: 1,
          gap: 2,
          height: "100vh",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Row 1: Patient Info */}
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <PatientInfo results={results} />
          </Box>{" "}
          {/* Row 2: HCV Analysis, HCV Status, Risk, and Stage fetures impotance */}
          <Box sx={{ display: "flex", width: "100%", gap: 2, height: "60vh" }}>
            {/* colunm 1: HCV Analysis */}
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <HCVAnalysis
                results={{
                  hcv_status_probability: hcvProbability,
                  confidence: confidence,
                  hcv_stage_probability: stagePredictions,
                }}
                getProbabilityColor={(prob) =>
                  getProbabilityColor(prob, hcvRisk)
                }
                getStageColor={getStageColor}
              />
            </Box>
            {/* colunm 2: HCV Status, Risk, and Stage , fetures impotance*/}
            <Box
              sx={{
                width: "50%",
                flexDirection: "column",
                display: "flex",
                gap: 2,
              }}
            >
              {/* Row 1: HCV Status, Risk, and Stage */}
              <Box
                sx={{
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "100%",
                }}
              >
                <HcvStatusRiskStage
                  status={hcvStatus}
                  risk={hcvRisk}
                  stage={hcvStage}
                  probability={hcvProbability}
                />
              </Box>
              {/* Row 2: Feature Importance */}
              {Object.keys(featureImportance).length > 0 && (
                <Box sx={{ height: "70%", width: "100%" }}>
                  <FeatureImportance
                    results={{
                      feature_importance: featureImportance,
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>{" "}
        </Box>{" "}
        {/* Row 3: Medical Recommendation - Full Width */}
        <Box sx={{ mt: 2 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: hcvRisk
                ? hcvRisk.toLowerCase() === "high"
                  ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
                  : hcvRisk.toLowerCase() === "medium" ||
                    hcvRisk.toLowerCase() === "moderate"
                  ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
                  : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              border: hcvRisk
                ? hcvRisk.toLowerCase() === "high"
                  ? "1px solid #fecaca"
                  : hcvRisk.toLowerCase() === "medium" ||
                    hcvRisk.toLowerCase() === "moderate"
                  ? "1px solid #fde68a"
                  : "1px solid #bbf7d0"
                : "1px solid #e2e8f0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Psychology
                sx={{
                  fontSize: "1.5rem",
                  color: hcvRisk
                    ? hcvRisk.toLowerCase() === "high"
                      ? "#dc2626"
                      : hcvRisk.toLowerCase() === "medium" ||
                        hcvRisk.toLowerCase() === "moderate"
                      ? "#d97706"
                      : "#059669"
                    : "#667eea",
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                color={
                  hcvRisk
                    ? hcvRisk.toLowerCase() === "high"
                      ? "#dc2626"
                      : hcvRisk.toLowerCase() === "medium" ||
                        hcvRisk.toLowerCase() === "moderate"
                      ? "#d97706"
                      : "#059669"
                    : "#374151"
                }
              >
                Medical Recommendation
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                color: hcvRisk
                  ? hcvRisk.toLowerCase() === "high"
                    ? "#7f1d1d"
                    : hcvRisk.toLowerCase() === "medium" ||
                      hcvRisk.toLowerCase() === "moderate"
                    ? "#92400e"
                    : "#14532d"
                  : "#4B5563",
                backgroundColor: "white",
                p: 2,
                borderRadius: 1,
                border: hcvRisk
                  ? hcvRisk.toLowerCase() === "high"
                    ? "1px solid #fecaca"
                    : hcvRisk.toLowerCase() === "medium" ||
                      hcvRisk.toLowerCase() === "moderate"
                    ? "1px solid #fde68a"
                    : "1px solid #bbf7d0"
                  : "1px solid #E5E7EB",
              }}
            >
              {recommendation}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

DiagnosisResults.propTypes = {
  loading: PropTypes.bool.isRequired,
  results: PropTypes.shape({
    patient: PropTypes.shape({
      hcv_result: PropTypes.shape({
        patient: PropTypes.number,
        hcv_status: PropTypes.string,
        hcv_status_probability: PropTypes.number,
        hcv_risk: PropTypes.string,
        hcv_stage: PropTypes.string,
        confidence: PropTypes.number,
        hcv_stage_probability: PropTypes.objectOf(PropTypes.number),
        recommendation: PropTypes.string,
        diagnosis_completed: PropTypes.bool,
        analysis_duration: PropTypes.number,
        feature_importance: PropTypes.objectOf(PropTypes.number),
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
      }),
    }),
    feature_importance: PropTypes.objectOf(PropTypes.number),
  }),
};

DiagnosisResults.defaultProps = {
  results: null,
};

export default DiagnosisResults;
