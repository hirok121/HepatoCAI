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
  Grid,
} from "@mui/material";
import { Assessment, LocalHospital, TrendingUp } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function HCVAnalysis({ results, getProbabilityColor, getStageColor }) {
  const hcvProbability = results.hcv_status_probability || 0;
  const stagePredictions = results.hcv_stage_probability || {};

  const pieData = [
    {
      name: "HCV Positive",
      value: hcvProbability * 100,
      color: getProbabilityColor(hcvProbability),
    },
    {
      name: "HCV Negative",
      value: (1 - hcvProbability) * 100,
      color: "#E5E7EB",
    },
  ];

  return (
    <Card
      sx={{
        height: "100%",
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 32px rgba(14, 165, 233, 0.1)",
          borderColor: "#0ea5e9",
        },
      }}
    >
      <CardContent
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Compact Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: "#0ea5e9",
              borderRadius: "50%",
              p: 1,
              mr: 1.5,
            }}
          >
            <Assessment sx={{ color: "white", fontSize: "1.2rem" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontSize="1rem" fontWeight="bold">
              HCV Analysis
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Probability assessment
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2,
            alignItems: "center",
            mb: 2,
            flex: 1,
          }}
        >
          {/* Compact Pie Chart */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 160,
            }}
          >
            <Typography variant="caption" color="text.secondary" gutterBottom>
              HCV Distribution
            </Typography>
            <Box sx={{ height: 120, width: 120, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
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
                  variant="h6"
                  sx={{
                    color: getProbabilityColor(hcvProbability),
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {(hcvProbability * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Compact Progress */}
          <Box sx={{ flex: 1, minWidth: 120 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Risk Assessment
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" fontSize="0.8rem">
                  HCV Probability
                </Typography>
                <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
                  {(hcvProbability * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={hcvProbability * 100}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: "#F1F5F9",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getProbabilityColor(hcvProbability),
                    borderRadius: 2,
                  },
                }}
              />
              <Box sx={{ mt: 1.5 }}>
                <Chip
                  label={`${(results.confidence * 100).toFixed(1)}% Confidence`}
                  sx={{
                    backgroundColor: "#F1F5F9",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: "auto",
                    "& .MuiChip-label": { px: 1, py: 0.5 },
                  }}
                  icon={<LocalHospital sx={{ fontSize: "0.9rem" }} />}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Compact Stage Predictions */}
        {Object.keys(stagePredictions).length > 0 && (
          <Box sx={{ mt: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingUp sx={{ color: "#0ea5e9", mr: 1, fontSize: "1rem" }} />
              <Typography variant="body2" fontWeight={600}>
                Stage Predictions
              </Typography>
            </Box>

            <Grid container spacing={1}>
              {Object.entries(stagePredictions).map(([stage, probability]) => (
                <Grid item xs={6} key={stage}>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: "#f8fafc",
                      borderRadius: 1,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        sx={{ color: "#1a202c" }}
                      >
                        {stage.replace("Class ", "S")}
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color={getStageColor ? getStageColor(stage) : "#2563EB"}
                      >
                        {(probability * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={probability * 100}
                      sx={{
                        height: 4,
                        borderRadius: 1,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getStageColor
                            ? getStageColor(stage)
                            : "#2563EB",
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// PropTypes validation
HCVAnalysis.propTypes = {
  results: PropTypes.shape({
    hcv_status_probability: PropTypes.number,
    confidence: PropTypes.number.isRequired,
    hcv_stage_probability: PropTypes.object,
  }).isRequired,
  getProbabilityColor: PropTypes.func.isRequired,
  getStageColor: PropTypes.func,
};

export default HCVAnalysis;
