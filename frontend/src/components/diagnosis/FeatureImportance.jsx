// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Analytics,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

function FeatureImportance({ results }) {
  const sortedFeatures = Object.entries(results.feature_importance).sort(
    ([, a], [, b]) => Math.abs(b) - Math.abs(a)
  );

  const getImpactColor = (importance) => {
    if (importance > 0.3) return "#DC2626"; // Strong positive
    if (importance > 0.1) return "#EA580C"; // Moderate positive
    if (importance > -0.1) return "#65A30D"; // Neutral/weak
    if (importance > -0.3) return "#059669"; // Moderate negative
    return "#047857"; // Strong negative
  };

  const getImpactIcon = (importance) => {
    if (Math.abs(importance) > 0.2) {
      return importance > 0 ? (
        <ArrowUpward fontSize="small" />
      ) : (
        <ArrowDownward fontSize="small" />
      );
    }
    return importance > 0 ? (
      <TrendingUp fontSize="small" />
    ) : (
      <TrendingDown fontSize="small" />
    );
  };

  const getImpactLabel = (importance) => {
    const absImportance = Math.abs(importance);
    if (absImportance > 0.3) return "High Impact";
    if (absImportance > 0.1) return "Moderate Impact";
    return "Low Impact";
  };

  return (
    <Card
      sx={{
        height: "100%",
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: "#3b82f6",
              color: "white",
              mr: 2,
            }}
          >
            <Analytics fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Feature Importance Analysis
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Impact on diagnosis prediction
            </Typography>
          </Box>
          <Tooltip title="Features ranked by their influence on the model's prediction">
            <Info sx={{ ml: "auto", color: "#64748b", cursor: "help" }} />
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {/* Legend */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Impact Legend
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              size="small"
              label="Increases Risk"
              sx={{ backgroundColor: "#fecaca", color: "#dc2626" }}
            />
            <Chip
              size="small"
              label="Decreases Risk"
              sx={{ backgroundColor: "#bbf7d0", color: "#059669" }}
            />
          </Stack>
        </Box>{" "}
        {/* Feature Row */}
        <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
          {sortedFeatures.map(([feature, importance], index) => (
            <Paper
              key={feature}
              elevation={0}
              sx={{
                p: 1,
                flex: 1,
                minWidth: 70,
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                background:
                  index < 3
                    ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                    : "#ffffff",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              {/* Rank indicator for top 3 */}
              {index < 3 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    backgroundColor:
                      index === 0
                        ? "#fbbf24"
                        : index === 1
                        ? "#94a3b8"
                        : "#f59e0b",
                    color: "white",
                    borderRadius: "50%",
                    width: 14,
                    height: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.55rem",
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </Box>
              )}

              {/* Icon */}
              <Box
                sx={{
                  color: getImpactColor(importance),
                  mb: 0.3,
                  fontSize: "0.9rem",
                }}
              >
                {getImpactIcon(importance)}
              </Box>

              {/* Feature Name */}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.55rem",
                  mb: 0.3,
                  lineHeight: 1,
                }}
              >
                {feature.toUpperCase()}
              </Typography>

              {/* Progress bar */}
              <Box sx={{ width: "100%", mb: 0.3 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: 3,
                    backgroundColor: "#e2e8f0",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.abs(importance) * 100}%`,
                      height: "100%",
                      backgroundColor: getImpactColor(importance),
                      transition: "width 0.8s ease-in-out",
                    }}
                  />
                </Box>
              </Box>

              {/* Score */}
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, fontSize: "0.5rem", mb: 0.2 }}
              >
                {importance > 0 ? "+" : ""}
                {importance.toFixed(2)}
              </Typography>

              {/* Patient Value */}
              {results[feature] && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.45rem", lineHeight: 1 }}
                >
                  {results[feature]}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Add PropTypes validation
FeatureImportance.propTypes = {
  results: PropTypes.shape({
    feature_importance: PropTypes.objectOf(PropTypes.number).isRequired,
    // Add other properties that might be accessed from results
    // Based on the code, results[feature] is also accessed, so we include those lab values
    Age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ALP: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    AST: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CHE: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CREA: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    CGT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default FeatureImportance;
