// eslint-disable-next-line no-unused-vars
import React from "react";
import { Alert, Typography } from "@mui/material";
import { Warning } from "@mui/icons-material";

function MedicalDisclaimer() {
  return (
    <Alert
      severity="warning"
      icon={<Warning />}
      sx={{
        mt: 4,
        borderRadius: 3,
        backgroundColor: "#FEF3C7",
        border: "1px solid #F59E0B",
      }}
    >
      <Typography variant="body2" sx={{ color: "#92400E" }}>
        <strong>Medical Disclaimer:</strong> This AI tool is for educational and
        research purposes only. Results should not replace professional medical
        diagnosis. Always consult qualified healthcare professionals for
        clinical decisions. Model performance based on UCI dataset may not
        reflect all clinical scenarios.
      </Typography>
    </Alert>
  );
}

export default MedicalDisclaimer;
