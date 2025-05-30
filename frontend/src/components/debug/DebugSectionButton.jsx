// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Button, Tooltip } from "@mui/material";
import { BugReport } from "@mui/icons-material";
import { FEATURES } from "../../config/constants";

function DebugSectionButton({
  sectionName,
  fields,
  handleChange,
  handleSymptomToggle,
  formData,
  randomValueGenerators,
}) {
  // Only render if debug mode is enabled
  if (!FEATURES.ENABLE_DIAGNOSIS_DEBUG) {
    return null;
  }

  const handleDebugFillSection = () => {
    fields.forEach((fieldName) => {
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
    });
  };

  return (
    <Tooltip
      title={`Fill all ${sectionName} fields with random data`}
      placement="top"
    >
      <Button
        variant="outlined"
        startIcon={<BugReport />}
        onClick={handleDebugFillSection}
        size="small"
        sx={{
          color: "#ff9800",
          borderColor: "rgba(255, 152, 0, 0.5)",
          backgroundColor: "rgba(255, 152, 0, 0.05)",
          mb: 2,
          "&:hover": {
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            borderColor: "#ff9800",
            transform: "scale(1.02)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Fill {sectionName} with Random Data
      </Button>
    </Tooltip>
  );
}

DebugSectionButton.propTypes = {
  sectionName: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSymptomToggle: PropTypes.func,
  formData: PropTypes.object,
  randomValueGenerators: PropTypes.object.isRequired,
};

export default DebugSectionButton;
