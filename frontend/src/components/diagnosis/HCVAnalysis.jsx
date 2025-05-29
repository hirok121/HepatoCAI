// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Assessment, LocalHospital } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function HCVAnalysis({ results, getProbabilityColor }) {
  const pieData = [
    {
      name: "HCV Positive",
      value: results.hcv_probability * 100,
      color: getProbabilityColor(results.hcv_probability),
    },
    {
      name: "HCV Negative",
      value: (1 - results.hcv_probability) * 100,
      color: "#E5E7EB",
    },
  ];

  return (
    <Card sx={{ mb: 3, border: "1px solid #E2E8F0" }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Assessment sx={{ color: "#2563EB", mr: 2 }} />
          <Typography variant="h6">HCV Detection Analysis</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Pie Chart */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              HCV Probability Distribution
            </Typography>
            <Box sx={{ height: 200, width: 250, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: getProbabilityColor(results.hcv_probability),
                    fontWeight: 700,
                  }}
                >
                  {(results.hcv_probability * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  HCV Risk
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Linear Progress */}
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 300 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Linear Progress Indicator
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">HCV Probability</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {(results.hcv_probability * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={results.hcv_probability * 100}
                sx={{
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: "#F1F5F9",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getProbabilityColor(
                      results.hcv_probability
                    ),
                    borderRadius: 2,
                  },
                }}
              />
              <Box sx={{ mt: 3 }}>
                <Chip
                  label={`${(results.confidence * 100).toFixed(
                    1
                  )}% Model Confidence`}
                  sx={{
                    backgroundColor: "#F1F5F9",
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 2 },
                  }}
                  icon={<LocalHospital />}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// generate propstype validation
HCVAnalysis.propTypes = {
  results: PropTypes.shape({
    hcv_probability: PropTypes.number.isRequired,
    confidence: PropTypes.number.isRequired,
  }).isRequired,
  getProbabilityColor: PropTypes.func.isRequired,
};

export default HCVAnalysis;
