import React from "react";
import { Box, Typography } from "@mui/material";
import { AccessTime, Shield, Timeline } from "@mui/icons-material";

const EarlyDetectionBenefits = () => {
  const benefits = [
    {
      icon: <AccessTime />,
      title: "Timely Treatment",
      desc: "Critical for starting treatment promptly and improving outcomes",
    },
    {
      icon: <Timeline />,
      title: "Better Outcomes",
      desc: "Enables more effective treatment and long-term monitoring",
    },
    {
      icon: <Shield />,
      title: "Prevents Damage",
      desc: "Helps slow or prevent progression to severe liver conditions",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#059669",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Shield sx={{ mr: 1 }} />
        Why Early Detection Helps:
      </Typography>

      {benefits.map((benefit, index) => (
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
              color: "#059669",
              mr: 3,
              mt: 0.5,
              minWidth: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(5, 150, 105, 0.1)",
              borderRadius: "8px",
              p: 1,
            }}
          >
            {benefit.icon}
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
              {benefit.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.875rem",
              }}
            >
              {benefit.desc}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EarlyDetectionBenefits;
