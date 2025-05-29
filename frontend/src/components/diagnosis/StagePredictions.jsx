// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function StagePredictions({ results, getStageColor }) {
  const barData = Object.entries(results.stage_predictions).map(
    ([stage, prob]) => ({
      stage: stage.replace("Class ", "").replace(" (", "\n("),
      probability: prob * 100,
      color: getStageColor(stage),
    })
  );

  return (
    <Card sx={{ mb: 3, border: "1px solid #E2E8F0" }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TrendingUp sx={{ color: "#2563EB", mr: 2 }} />
          Liver Disease Stage Predictions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Bar Chart */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stage Probability Distribution
            </Typography>
            <Box sx={{ height: 300, width: 600 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="stage"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis
                    label={{
                      value: "Probability (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toFixed(1)}%`,
                      "Probability",
                    ]}
                    labelFormatter={(label) => `Stage: ${label}`}
                  />
                  <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Stage Chips */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stage Summary Chips
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              {Object.entries(results.stage_predictions).map(
                ([stage, prob]) => (
                  <Chip
                    key={stage}
                    label={`${stage}: ${(prob * 100).toFixed(1)}%`}
                    sx={{
                      backgroundColor: getStageColor(stage),
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      height: 40,
                      minWidth: 250,
                      justifyContent: "flex-start",
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                )
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// generate propstype validation
StagePredictions.propTypes = {
  results: PropTypes.shape({
    stage_predictions: PropTypes.object.isRequired,
  }).isRequired,
  getStageColor: PropTypes.func.isRequired,
};

export default StagePredictions;
