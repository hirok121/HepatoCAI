// eslint-disable-next-line no-unused-vars
import React from "react";
import { Alert, Typography } from "@mui/material";
import { Warning } from "@mui/icons-material";

function MedicalDisclaimer() {
  return (
    <Alert
      severity="warning"
      icon={<Warning sx={{ fontSize: "1rem" }} />}
      sx={{
        borderRadius: 2,
        backgroundColor: "#FEF3C7",
        border: "1px solid #F59E0B",
        py: 1,
        px: 2,
        mt: 2,
      }}
    >
      <Typography variant="body2" sx={{ color: "#92400E", fontSize: "0.8rem" }}>
        <strong>Medical Disclaimer:</strong> This AI tool is for educational and
        research purposes only. Results should not replace professional medical
        diagnosis. Always consult qualified healthcare professionals for
        clinical decisions.
      </Typography>
    </Alert>
  );
}

export default MedicalDisclaimer;
