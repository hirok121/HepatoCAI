// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Grid,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

function FeatureImportance({ results }) {
  return (
    <Card sx={{ border: "1px solid #E2E8F0" }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TrendingUp sx={{ color: "#2563EB", mr: 2 }} />
          <Typography variant="h6">Feature Importance Analysis</Typography>
        </Box>

        <Grid container spacing={2}>
          {Object.entries(results.feature_importance).map(
            ([feature, importance]) => (
              <Grid item xs={12} sm={6} md={4} key={feature}>
                <Box sx={{ p: 2, backgroundColor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {feature.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.abs(importance) * 100}
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 1,
                        backgroundColor: "#E2E8F0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            importance > 0 ? "#EF4444" : "#10B981",
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                      {importance > 0 ? "+" : ""}
                      {importance.toFixed(3)}
                    </Typography>
                  </Box>
                  {results[feature] && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Value: {results[feature]}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )
          )}
        </Grid>
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
    GGT: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default FeatureImportance;
