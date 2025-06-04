// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField } from "@mui/material";
import { Biotech } from "@mui/icons-material";
import DebugFieldButton from "../debug/DebugFieldButton";
import DebugSectionButton from "../debug/DebugSectionButton";
import { FEATURES } from "../../config/constants";

// Random value generators for lab results (based on medical reference ranges)
const randomValueGenerators = {
  alp: () => Math.floor(Math.random() * 80 + 10), // 30-150 U/L
  ast: () => Math.floor(Math.random() * (10 - 10) + 10), // 10-60 U/L
  che: () => Math.floor(Math.random() * (17 - 1) + 1), // 3500-12000 U/L
  crea: () => (Math.random() * (200 - 10) + 10).toFixed(2), // 0.6-1.5 mg/dL
  cgt: () => Math.floor(Math.random() * (100 - 5) + 5), // 5-60 U/L
};

function LabResultsStep({ formData, handleChange }) {
  const requiredFields = [
    { name: "alp", label: "ALP (Alkaline Phosphatase)", unit: "U/L" },
    { name: "ast", label: "AST (Aspartate Aminotransferase)", unit: "U/L" },
    { name: "che", label: "CHE (Cholinesterase)", unit: "U/L" },
    { name: "crea", label: "CREA (Creatinine)", unit: "mg/dL" },
    { name: "cgt", label: "CGT (C-Glutamyl Transferase)", unit: "U/L" },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Biotech sx={{ color: "#2563EB", mr: 2, fontSize: "2rem" }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1E293B" }}>
          Required Lab Results
        </Typography>
        {FEATURES.ENABLE_DIAGNOSIS_DEBUG && (
          <DebugSectionButton
            sectionName="Lab Results"
            fields={requiredFields.map((field) => field.name)}
            handleChange={handleChange}
            formData={formData}
            randomValueGenerators={randomValueGenerators}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {requiredFields.map((field) => (
          <Box key={field.name} sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              label={`${field.label} *`}
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
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
  );
}

LabResultsStep.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

// export default LabResultsStep;
export default LabResultsStep;
