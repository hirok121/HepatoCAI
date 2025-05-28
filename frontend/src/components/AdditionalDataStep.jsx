// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField, Chip } from "@mui/material";
import { Science, Psychology } from "@mui/icons-material";

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
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              helperText={`Units: ${field.unit}`}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
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
