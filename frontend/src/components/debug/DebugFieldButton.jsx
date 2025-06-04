// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import { BugReport } from "@mui/icons-material";
import { FEATURES } from "../../config/constants";

// Random value generators for different field types
const randomValueGenerators = {
  // Patient Info generators
  patientName: () => {
    const firstNames = [
      "John",
      "Jane",
      "Michael",
      "Sarah",
      "David",
      "Lisa",
      "James",
      "Emily",
      "Robert",
      "Jessica",
      "William",
      "Ashley",
      "Christopher",
      "Amanda",
      "Daniel",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
    ];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  },

  age: () => Math.floor(Math.random() * 80) + 18, // 18-98 years

  sex: () => (Math.random() > 0.5 ? "Male" : "Female"),

  // Lab Results generators (based on medical reference ranges)
  alp: () => Math.floor(Math.random() * (150 - 30) + 30), // 30-150 U/L
  ast: () => Math.floor(Math.random() * (60 - 10) + 10), // 10-60 U/L
  che: () => Math.floor(Math.random() * (12000 - 3500) + 3500), // 3500-12000 U/L
  crea: () => (Math.random() * (1.5 - 0.6) + 0.6).toFixed(2), // 0.6-1.5 mg/dL
  cgt: () => Math.floor(Math.random() * (60 - 5) + 5), // 5-60 U/L

  // Optional Parameters generators
  alb: () => (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // 3.5-5.0 g/dL
  bil: () => (Math.random() * (1.2 - 0.2) + 0.2).toFixed(2), // 0.2-1.2 mg/dL
  chol: () => Math.floor(Math.random() * (300 - 120) + 120), // 120-300 mg/dL
  prot: () => (Math.random() * (8.5 - 6.0) + 6.0).toFixed(1), // 6.0-8.5 g/dL
  alt: () => Math.floor(Math.random() * (60 - 7) + 7), // 7-60 U/L

  // Symptoms generator
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

function DebugFieldButton({
  fieldName,
  handleChange,
  handleSymptomToggle,
  formData,
}) {
  // Only render if debug mode is enabled
  if (!FEATURES.ENABLE_DIAGNOSIS_DEBUG) {
    return null;
  }

  const handleDebugClick = () => {
    const generator = randomValueGenerators[fieldName];
    if (!generator) {
      console.warn(`No random generator found for field: ${fieldName}`);
      return;
    }

    const randomValue = generator();

    // Handle symptoms differently since they use a different handler
    if (fieldName === "symptoms") {
      // Clear existing symptoms first
      if (formData.symptoms && formData.symptoms.length > 0) {
        formData.symptoms.forEach((symptom) => {
          handleSymptomToggle(symptom);
        });
      }

      // Add new random symptoms
      randomValue.forEach((symptom) => {
        handleSymptomToggle(symptom);
      });
    } else {
      // Handle regular form fields
      const event = {
        target: {
          name: fieldName,
          value: randomValue,
        },
      };
      handleChange(event);
    }
  };

  return (
    <Tooltip title={`Fill ${fieldName} with random data`} placement="top">
      <IconButton
        onClick={handleDebugClick}
        size="small"
        sx={{
          color: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          border: "1px solid rgba(255, 152, 0, 0.3)",
          ml: 1,
          "&:hover": {
            backgroundColor: "rgba(255, 152, 0, 0.2)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <BugReport fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

DebugFieldButton.propTypes = {
  fieldName: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSymptomToggle: PropTypes.func,
  formData: PropTypes.object,
};

export default DebugFieldButton;
