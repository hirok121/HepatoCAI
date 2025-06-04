// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import { Person, Biotech, MedicalServices } from "@mui/icons-material";

function PatientInfo({ results }) {
  const patient_info = results.patient;
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
          <span>Name: {patient_info.patient_name}</span>
          <span>Sex: {patient_info.sex}</span>
          <span>Age: {patient_info.age}</span>
        </Typography>
        {/* Laboratory Values Grid */}
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <Biotech sx={{ color: "#2563EB", mr: 0.5, fontSize: "1rem" }} />
          <Typography variant="h6" fontSize="0.9rem">
            Laboratory Values
          </Typography>
        </Box>{" "}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            mb: 0.5,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
          }}
        >
          <span>ALP: {patient_info.alp} U/L</span>
          <span>AST: {patient_info.ast} U/L</span>
          <span>CHE: {patient_info.che} kU/L</span>
          <span>CREA: {patient_info.crea} mg/dL</span>
          <span>CGT: {patient_info.cgt} U/L</span>
        </Typography>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
            mb: 0.5,
          }}
        >
          <span>ALB: {patient_info.alb} g/dL</span>
          <span>BIL: {patient_info.bil} mg/dL</span>
          <span>CHOL: {patient_info.chol} mg/dL</span>
          <span>PROT: {patient_info.prot} g/dL</span>
          <span>ALT: {patient_info.alt} U/L</span>
        </Typography>
        {/* Symptoms Section */}
        {patient_info.symptoms && (
          <>
            {" "}
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <MedicalServices
                sx={{ color: "#2563EB", mr: 0.5, fontSize: "1rem" }}
              />
              <Typography variant="h6" fontSize="0.9rem">
                Symptoms
              </Typography>
            </Box>{" "}
            <Typography variant="body2" fontWeight={600}>
              {patient_info.symptoms}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
PatientInfo.propTypes = {
  results: PropTypes.shape({
    patient: PropTypes.shape({
      patient_name: PropTypes.string,
      age: PropTypes.number,
      sex: PropTypes.string,
      alp: PropTypes.number,
      ast: PropTypes.number,
      che: PropTypes.number,
      crea: PropTypes.number,
      cgt: PropTypes.number,
      alb: PropTypes.number,
      bil: PropTypes.number,
      chol: PropTypes.number,
      prot: PropTypes.number,
      alt: PropTypes.number,
      symptoms: PropTypes.string,
    }),
  }).isRequired,
};

export default PatientInfo;
