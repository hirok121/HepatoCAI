// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import { Person } from "@mui/icons-material";

function PatientInfo({ results }) {
  return (
    <Card sx={{ width: "100%", border: "1px solid #E2E8F0" }}>
      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <Person sx={{ color: "#2563EB", mr: 0.5, fontSize: "1rem" }} />
          <Typography variant="h6" fontSize="0.9rem">
            Patient Information
          </Typography>
        </Box>{" "}
        {/* Patient Info Inline Format */}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            mb: 0.5,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <span>Name: {results.patient_name}</span>
          <span>Sex: {results.sex}</span>
          <span>Age: {results.age}</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        {/* Compact Lab Values Grid */}
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          mb={0.5}
        >
          Laboratory Values
        </Typography>{" "}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            mb: 0.5,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <span>ALP: {results.ALP} U/L</span>
          <span>AST: {results.AST} U/L</span>
          <span>CHE: {results.CHE} kU/L</span>
          <span>CREA: {results.CREA} mg/dL</span>
          <span>GGT: {results.GGT} U/L</span>
        </Typography>
      </CardContent>
    </Card>
  );
}
PatientInfo.propTypes = {
  results: PropTypes.object.isRequired,
};

export default PatientInfo;
