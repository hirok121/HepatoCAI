// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import { Person } from "@mui/icons-material";

function PatientInfo({ results }) {
  return (
    <Card sx={{ mb: 3, border: "1px solid #E2E8F0" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Person sx={{ color: "#2563EB", mr: 2 }} />
          <Typography variant="h6">Patient Information</Typography>
        </Box>

        {/* Basic Patient Info */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {results.patient_name}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="body2" color="text.secondary">
              Age
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {results.age} years
            </Typography>
          </Box>
          <Box sx={{ minWidth: 100 }}>
            <Typography variant="body2" color="text.secondary">
              Sex
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {results.sex}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 150 }}>
            <Typography variant="body2" color="text.secondary">
              Analysis Date
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Lab Values */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Laboratory Values
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                ALP
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {results.ALP || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                AST
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {results.AST || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                CHE
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {results.CHE || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                CREA
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {results.CREA || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="body2" color="text.secondary">
                GGT
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {results.GGT || "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
PatientInfo.propTypes = {
  results: PropTypes.object.isRequired,
};

export default PatientInfo;
