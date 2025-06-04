// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField, Chip } from "@mui/material";
import { Science, Psychology } from "@mui/icons-material";
import DebugFieldButton from "../debug/DebugFieldButton";
import DebugSectionButton from "../debug/DebugSectionButton";
import { FEATURES } from "../../config/constants";

// Random value generators for optional parameters and symptoms
const randomValueGenerators = {
  alb: () => (Math.random() * (80 - 20) + 20).toFixed(1), // 3.5-5.0 g/dL
  bil: () => (Math.random() * (50 - 2) + 2).toFixed(2), // 0.2-1.2 mg/dL
  chol: () => Math.floor(Math.random() * (10 - 1) + 1), // 120-300 mg/dL
  prot: () => (Math.random() * (90 - 51.0) + 51.0).toFixed(1), // 6.0-8.5 g/dL
  alt: () => Math.floor(Math.random() * (60 - 0) + 0), // 7-60 U/L
  symptoms: () => {
    const allSymptoms = [
      "Fatigue",
      "Nausea",
      "Abdominal Pain",
      "Jaundice",
      "Dark Urine",
      "Loss of Appetite",
      "Weight Loss",
      "Fever",
      "Joint Pain",
      "Clay-colored Stools",
    ];
    const numSymptoms = Math.floor(Math.random() * 4); // 0-3 symptoms
    const selectedSymptoms = [];

    for (let i = 0; i < numSymptoms; i++) {
      const availableSymptoms = allSymptoms.filter(
        (s) => !selectedSymptoms.includes(s)
      );
      if (availableSymptoms.length > 0) {
        const randomSymptom =
          availableSymptoms[
            Math.floor(Math.random() * availableSymptoms.length)
          ];
        selectedSymptoms.push(randomSymptom);
      }
    }

    return selectedSymptoms;
  },
};

function AdditionalDataStep({ formData, handleChange, handleSymptomToggle }) {
  const optionalFields = [
    { name: "alb", label: "ALB (Albumin)", unit: "g/dL" },
    { name: "bil", label: "BIL (Bilirubin)", unit: "mg/dL" },
    { name: "chol", label: "CHOL (Cholesterol)", unit: "mg/dL" },
    { name: "prot", label: "PROT (Protein)", unit: "g/dL" },
    { name: "alt", label: "ALT (Alanine Aminotransferase)", unit: "U/L" },
  ];

  const symptoms = [
    "Fatigue",
    "Nausea",
    "Abdominal Pain",
    "Jaundice",
    "Dark Urine",
    "Loss of Appetite",
    "Weight Loss",
    "Fever",
    "Joint Pain",
    "Clay-colored Stools",
  ];
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      {/* Optional Parameters Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Science sx={{ color: "#2563EB", mr: 2, fontSize: "2rem" }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#1E293B" }}>
            Optional Parameters
          </Typography>
          {FEATURES.ENABLE_DIAGNOSIS_DEBUG && (
            <DebugSectionButton
              sectionName="Optional Parameters"
              fields={optionalFields.map((field) => field.name)}
              handleChange={handleChange}
              formData={formData}
              randomValueGenerators={randomValueGenerators}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {optionalFields.map((field) => (
            <Box
              key={field.name}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                fullWidth
                label={field.label}
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                helperText={`Units: ${field.unit}`}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <DebugFieldButton
                fieldName={field.name}
                handleChange={handleChange}
                formData={formData}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Symptoms Section */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Psychology sx={{ color: "#2563EB", mr: 2, fontSize: "2rem" }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#1E293B" }}>
            Clinical Symptoms
          </Typography>
          {FEATURES.ENABLE_DIAGNOSIS_DEBUG && (
            <DebugFieldButton
              fieldName="symptoms"
              handleChange={handleChange}
              handleSymptomToggle={handleSymptomToggle}
              formData={formData}
            />
          )}
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: "#475569" }}>
          Select any symptoms the patient is experiencing (optional):
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {symptoms.map((symptom) => (
            <Chip
              key={symptom}
              label={symptom}
              onClick={() => handleSymptomToggle(symptom)}
              color={
                formData.symptoms.includes(symptom) ? "primary" : "default"
              }
              variant={
                formData.symptoms.includes(symptom) ? "filled" : "outlined"
              }
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                "&:hover": { transform: "scale(1.05)" },
                transition: "all 0.2s ease",
                fontSize: "0.9rem",
                px: 2,
                py: 1,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

AdditionalDataStep.propTypes = {
  formData: PropTypes.shape({
    alb: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bil: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    chol: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prot: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    alt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    symptoms: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSymptomToggle: PropTypes.func.isRequired,
};
export default AdditionalDataStep;
// AdditionalDataStep.jsx
