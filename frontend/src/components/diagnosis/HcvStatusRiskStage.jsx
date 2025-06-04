// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import {
  CheckCircle,
  Warning,
  Cancel,
  Help,
  Security,
  Error,
  WarningAmber,
  Timeline,
  TrendingUp,
  LocalHospital,
} from "@mui/icons-material";

// HcvStatusCard Component
const HcvStatusCard = ({ status, probability }) => {
  const getStatusConfig = (status) => {
    const configs = {
      Positive: {
        color: "#dc2626",
        bgColor: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
        borderColor: "#fecaca",
        icon: <Cancel sx={{ color: "#dc2626", fontSize: "1.2rem" }} />,
        chipColor: "error",
        textColor: "#991b1b",
      },
      Negative: {
        color: "#16a34a",
        bgColor: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        borderColor: "#bbf7d0",
        icon: <CheckCircle sx={{ color: "#16a34a", fontSize: "1.2rem" }} />,
        chipColor: "success",
        textColor: "#15803d",
      },
      Suspected: {
        color: "#d97706",
        bgColor: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        borderColor: "#fed7aa",
        icon: <Warning sx={{ color: "#d97706", fontSize: "1.2rem" }} />,
        chipColor: "warning",
        textColor: "#a16207",
      },
      Unknown: {
        color: "#6b7280",
        bgColor: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        borderColor: "#d1d5db",
        icon: <Help sx={{ color: "#6b7280", fontSize: "1.2rem" }} />,
        chipColor: "default",
        textColor: "#4b5563",
      },
    };
    return configs[status] || configs["Unknown"];
  };

  const config = getStatusConfig(status);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 4px 12px ${config.color}15`,
          borderColor: config.color,
        },
      }}
    >
      <CardContent
        sx={{
          p: 1.25,
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "white",
            border: `2px solid ${config.color}`,
            boxShadow: `0 2px 6px ${config.color}20`,
            mx: "auto",
          }}
        >
          {config.icon}
        </Box>

        <Typography
          variant="caption"
          fontWeight="600"
          sx={{
            color: config.textColor,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.65rem",
          }}
        >
          HCV Status
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="700"
          sx={{
            color: config.color,
            fontSize: "0.95rem",
            lineHeight: 1.2,
          }}
        >
          {status || "Unknown"}
        </Typography>

        {probability !== undefined && (
          <Chip
            label={`${(probability * 100).toFixed(1)}%`}
            color={config.chipColor}
            size="small"
            sx={{
              fontWeight: "600",
              fontSize: "0.65rem",
              height: "18px",
              borderRadius: "9px",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

HcvStatusCard.propTypes = {
  status: PropTypes.string,
  probability: PropTypes.number,
};

// HcvRiskCard Component
const HcvRiskCard = ({ risk, probability }) => {
  const getRiskConfig = (risk) => {
    const configs = {
      Low: {
        color: "#16a34a",
        bgColor: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        borderColor: "#bbf7d0",
        icon: <CheckCircle sx={{ color: "#16a34a", fontSize: "1.2rem" }} />,
        chipColor: "success",
        textColor: "#15803d",
      },
      Medium: {
        color: "#d97706",
        bgColor: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        borderColor: "#fed7aa",
        icon: <WarningAmber sx={{ color: "#d97706", fontSize: "1.2rem" }} />,
        chipColor: "warning",
        textColor: "#a16207",
      },
      High: {
        color: "#dc2626",
        bgColor: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
        borderColor: "#fecaca",
        icon: <Error sx={{ color: "#dc2626", fontSize: "1.2rem" }} />,
        chipColor: "error",
        textColor: "#991b1b",
      },
      Unknown: {
        color: "#6b7280",
        bgColor: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        borderColor: "#d1d5db",
        icon: <Security sx={{ color: "#6b7280", fontSize: "1.2rem" }} />,
        chipColor: "default",
        textColor: "#4b5563",
      },
    };
    return configs[risk] || configs["Unknown"];
  };

  const config = getRiskConfig(risk);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 4px 12px ${config.color}15`,
          borderColor: config.color,
        },
      }}
    >
      <CardContent
        sx={{
          p: 1.25,
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "white",
            border: `2px solid ${config.color}`,
            boxShadow: `0 2px 6px ${config.color}20`,
            mx: "auto",
          }}
        >
          {config.icon}
        </Box>

        <Typography
          variant="caption"
          fontWeight="600"
          sx={{
            color: config.textColor,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.65rem",
          }}
        >
          Risk Level
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="700"
          sx={{
            color: config.color,
            fontSize: "0.95rem",
            lineHeight: 1.2,
          }}
        >
          {risk || "Unknown"}
        </Typography>

        {probability !== undefined && (
          <Chip
            label={`${(probability * 100).toFixed(1)}%`}
            color={config.chipColor}
            size="small"
            sx={{
              fontWeight: "600",
              fontSize: "0.65rem",
              height: "18px",
              borderRadius: "9px",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

HcvRiskCard.propTypes = {
  risk: PropTypes.string,
  probability: PropTypes.number,
};

// HcvStageCard Component
const HcvStageCard = ({ stage }) => {
  const getStageConfig = (stage) => {
    const configs = {
      "Blood Donors": {
        color: "#16a34a",
        bgColor: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        borderColor: "#bbf7d0",
        icon: <CheckCircle sx={{ color: "#16a34a", fontSize: "1.2rem" }} />,
        chipColor: "success",
        textColor: "#15803d",
        description: "No Fibrosis",
      },
      Hepatitis: {
        color: "#65a30d",
        bgColor: "linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%)",
        borderColor: "#d9f99d",
        icon: <Timeline sx={{ color: "#65a30d", fontSize: "1.2rem" }} />,
        chipColor: "success",
        textColor: "#4d7c0f",
        description: "Mild Fibrosis",
      },
      Fibrosis: {
        color: "#d97706",
        bgColor: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        borderColor: "#fed7aa",
        icon: <TrendingUp sx={{ color: "#d97706", fontSize: "1.2rem" }} />,
        chipColor: "warning",
        textColor: "#a16207",
        description: "Moderate Fibrosis",
      },
      Cirrhosis: {
        color: "#ea580c",
        bgColor: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
        borderColor: "#fdba74",
        icon: <WarningAmber sx={{ color: "#ea580c", fontSize: "1.2rem" }} />,
        chipColor: "warning",
        textColor: "#c2410c",
        description: "Severe Fibrosis",
      },
      Unknown: {
        color: "#6b7280",
        bgColor: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        borderColor: "#d1d5db",
        icon: <Help sx={{ color: "#6b7280", fontSize: "1.2rem" }} />,
        chipColor: "default",
        textColor: "#4b5563",
        description: "Unknown Stage",
      },
    };
    return configs[stage] || configs["Unknown"];
  };

  const config = getStageConfig(stage);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 4px 12px ${config.color}15`,
          borderColor: config.color,
        },
      }}
    >
      <CardContent
        sx={{
          p: 1.25,
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.3,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "white",
            border: `2px solid ${config.color}`,
            boxShadow: `0 2px 6px ${config.color}20`,
            mx: "auto",
          }}
        >
          {config.icon}
        </Box>

        <Typography
          variant="caption"
          fontWeight="600"
          sx={{
            color: config.textColor,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.65rem",
          }}
        >
          HCV Stage
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight="700"
          sx={{
            color: config.color,
            fontSize: "0.95rem",
            lineHeight: 1.2,
          }}
        >
          {stage || "Unknown"}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: config.textColor,
            fontSize: "0.6rem",
            opacity: 0.8,
            lineHeight: 1.1,
          }}
        >
          {config.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

HcvStageCard.propTypes = {
  stage: PropTypes.string,
};

// Main Component
const HcvStatusRiskStage = ({ status, risk, stage, probability }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        gap: 0.75,
        alignItems: "stretch",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <HcvStatusCard status={status} probability={probability} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <HcvRiskCard risk={risk} probability={probability} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <HcvStageCard stage={stage} />
      </Box>
    </Box>
  );
};

HcvStatusRiskStage.propTypes = {
  status: PropTypes.string,
  risk: PropTypes.string,
  stage: PropTypes.string,
  probability: PropTypes.number,
};

export default HcvStatusRiskStage;
