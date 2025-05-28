// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Card, LinearProgress, Alert } from "@mui/material";
import { Psychology, Warning } from "@mui/icons-material";
import PatientInfo from "./PatientInfo";
import HCVAnalysis from "./HCVAnalysis";
import StagePredictions from "./StagePredictions";
import FeatureImportance from "./FeatureImportance";

function DiagnosisResults({ results, loading }) {
  if (loading) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <Box sx={{ mb: 3 }}>
          <Psychology sx={{ fontSize: "3rem", color: "#2563EB", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            AI Analysis in Progress...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Our AI is analyzing your data using advanced machine learning
            algorithms
          </Typography>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      </Card>
    );
  }

  if (!results) return null;

  const getProbabilityColor = (prob) => {
    if (prob > 0.7) return "#EF4444";
    if (prob > 0.4) return "#F59E0B";
    return "#10B981";
  };

  const getStageColor = (stage) => {
    const colors = {
      "Class 0 (Blood Donors)": "#10B981",
      "Class 1 (Hepatitis)": "#F59E0B",
      "Class 2 (Fibrosis)": "#EF4444",
      "Class 3 (Cirrhosis)": "#DC2626",
    };
    return colors[stage] || "#6B7280";
  };

  return (
    <Box sx={{ mt: 4 }}>
      <PatientInfo results={results} />

      <HCVAnalysis
        results={results}
        getProbabilityColor={getProbabilityColor}
      />

      <StagePredictions results={results} getStageColor={getStageColor} />

      {/* Recommendation */}
      <Alert
        severity={
          results.hcv_probability > 0.7
            ? "error"
            : results.hcv_probability > 0.4
            ? "warning"
            : "success"
        }
        icon={<Warning />}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" gutterBottom>
          Clinical Recommendation
        </Typography>
        <Typography>{results.recommendation}</Typography>
      </Alert>

      <FeatureImportance results={results} />
    </Box>
  );
}

//       const dummyResults = {
//         hcv_probability: 0.96, // Overall framework accuracy is 96.7% [cite: 7]
//         stage_predictions: {
//           "Class 0 (Blood Donors)": 0.05,
//           "Class 1 (Hepatitis)": 0.15,
//           "Class 2 (Fibrosis)": 0.6, // F1-score for Class 2 (Fibrosis) increased from 0.73 to 0.89 with SDV [cite: 109, 106]
//           "Class 3 (Cirrhosis)": 0.2, // F1-score for Class 3 (Cirrhosis) is 0.80 with SDV [cite: 106]
//         },
//         feature_importance: {
//           Age: 0.25, // Age is one of the 6 selected features by RFE [cite: 79]
//           ALP: 0.3, // ALP is one of the 6 selected features by RFE and a major indicator of liver diseases [cite: 79, 82]
//           AST: 0.2, // AST is one of the 6 selected features by RFE and a major indicator of liver diseases [cite: 79, 82]
//           CHE: 0.35, // CHE is one of the 6 selected features by RFE and a major indicator of liver diseases, showing strong contributions [cite: 79, 82, 85]
//           CREA: 0.1, // CREA is one of the 6 selected features by RFE [cite: 79]
//           GGT: 0.15, // GGT is one of the 6 selected features by RFE [cite: 79]
//         },
//         confidence: 0.95, // The Logistic Regression model achieved high ROC-AUC values (>=0.98) and an overall accuracy of 96.73% [cite: 107, 116]
//         recommendation:
//           "High probability of Hepatitis C Virus (HCV) infection detected. The AI analysis suggests Class 2 (Fibrosis) as the most likely liver disease stage. Immediate consultation with a hepatologist is strongly recommended for comprehensive evaluation and treatment planning, leveraging the insights from key indicators like CHE, ALP, and Age.",
//         patient_name: formData.patientName,
//         age: formData.age, // Assuming formData.age is available from your form
//         sex: formData.sex, // Assuming formData.sex is available from your form (e.g., "Male" or "Female")
//         // Include other lab values if you are collecting them, based on the 6 selected features:
//         ALP: formData.ALP,
//         AST: formData.AST,
//         CHE: formData.CHE,
//         CREA: formData.CREA,
//         GGT: formData.GGT,
//       };

DiagnosisResults.propTypes = {
  loading: PropTypes.bool.isRequired,
  results: PropTypes.shape({
    hcv_probability: PropTypes.number.isRequired,
    recommendation: PropTypes.string.isRequired,
    stage_predictions: PropTypes.objectOf(PropTypes.number).isRequired,
    feature_importance: PropTypes.objectOf(PropTypes.number).isRequired,
    confidence: PropTypes.number.isRequired,
    patient_name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sex: PropTypes.string,
    ALP: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    AST: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CHE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CREA: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    GGT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // Add other properties that your results object contains
    // For example:
    // patient_info: PropTypes.object,
    // stage_predictions: PropTypes.array,
    // feature_importance: PropTypes.array,
  }),
};

DiagnosisResults.defaultProps = {
  results: null,
};

export default DiagnosisResults;
