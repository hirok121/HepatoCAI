import React from "react";
import { Box, Typography } from "@mui/material";
import {
  Warning,
  Public,
  LocalHospital,
  TrendingDown,
} from "@mui/icons-material";

const ChallengeFeatures = ({ theme }) => {
  const challenges = [
    {
      icon: <Public />,
      title: "Global Burden",
      desc: "Affects ~58 million people, causing over 290,000 deaths annually from liver cirrhosis and cancer",
    },
    {
      icon: <LocalHospital />,
      title: "Diagnostic Hurdles",
      desc: "Traditional tests like biopsies are invasive, expensive, and require specialized labs",
    },
    {
      icon: <TrendingDown />,
      title: "AI Data Issues",
      desc: "Development faces challenges with imbalanced medical data and complex features",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#EF4444",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Warning sx={{ mr: 1 }} />
        The Challenge:
      </Typography>

      {challenges.map((challenge, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            justifyContent: { xs: "center", sm: "flex-start" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Box
            sx={{
              color: theme.palette.error.main,
              mr: 3,
              mt: 0.5,
              minWidth: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "8px",
              p: 1,
            }}
          >
            {challenge.icon}
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1E293B",
                mb: 0.5,
                fontSize: "1rem",
              }}
            >
              {challenge.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.875rem",
              }}
            >
              {challenge.desc}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChallengeFeatures;
