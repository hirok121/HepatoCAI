import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Person, Download, CalendarToday, Close } from "@mui/icons-material";

const DiagnosisCard = ({ diagnosis }) => {
  const [openDetail, setOpenDetail] = useState(false);
  // console.log("DiagnosisCard received diagnosis:", diagnosis);

  // Simple test render first
  if (!diagnosis) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography>No diagnosis data</Typography>
        </CardContent>
      </Card>
    );
  } // Extract patient data - API returns flat structure
  const patientName = diagnosis?.patient_name || "Unknown";
  const age = diagnosis?.age || "N/A";
  const sex = diagnosis?.sex || "N/A";

  // Extract diagnosis result data - API returns nested structure in hcv_result
  const hcvStatus = diagnosis?.hcv_result?.hcv_status || "Unknown";
  const hcvRisk = diagnosis?.hcv_result?.hcv_risk || "Unknown";
  const confidence = diagnosis?.hcv_result?.confidence || 0;
  const hcvStage = diagnosis?.hcv_result?.hcv_stage || "N/A";
  const createdAt = diagnosis?.created_at || null;

  // Extract lab values - all available from API
  const alp = diagnosis?.alp || "N/A";
  const ast = diagnosis?.ast || "N/A";
  const che = diagnosis?.che || "N/A";
  const crea = diagnosis?.crea || "N/A";
  const cgt = diagnosis?.cgt || "N/A";
  const alb = diagnosis?.alb || "N/A";
  const bil = diagnosis?.bil || "N/A";
  const chol = diagnosis?.chol || "N/A";
  const prot = diagnosis?.prot || "N/A";
  const alt = diagnosis?.alt || "N/A";

  // Extract additional data from nested structure
  const recommendation = diagnosis?.hcv_result?.recommendation || "N/A";
  const stagePredictions = diagnosis?.hcv_result?.hcv_stage_probability || {};
  const hcvStatusProbability =
    diagnosis?.hcv_result?.hcv_status_probability || 0;
  const symptoms = diagnosis?.symptoms || []; // Handle download functionality

  const handleDownload = () => {
    const reportData = diagnosis;
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagnosis_${patientName}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    return status === "Positive" ? "error" : "success";
  };

  const getRiskColor = (risk) => {
    const colors = {
      High: "error",
      Medium: "warning",
      Low: "success",
    };
    return colors[risk] || "default";
  };
  return (
    <>
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
        }}
        onClick={() => setOpenDetail(true)}
      >
        <CardContent>
          {/* Patient Info */}
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3">
                {patientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age: {age} • {sex}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Diagnosis Results */}
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Chip
              label={`HCV: ${hcvStatus}`}
              color={getStatusColor(hcvStatus)}
              size="small"
            />
            <Chip
              label={`Risk: ${hcvRisk}`}
              color={getRiskColor(hcvRisk)}
              size="small"
            />
            {hcvStage !== "N/A" && (
              <Chip label={`Stage: ${hcvStage}`} color="info" size="small" />
            )}
          </Box>

          {/* Additional Info */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Confidence: {(confidence * 100).toFixed(1)}%
            </Typography>
            {createdAt && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Download />}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
            >
              Download
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Detailed View Dialog */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Diagnosis Details - {patientName}
            </Typography>
            <Button onClick={() => setOpenDetail(false)} size="small">
              <Close />
            </Button>
          </Box>
        </DialogTitle>{" "}
        <DialogContent>
          {/* Patient Information Section */}
          <Box mb={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Patient Information
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6">{patientName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {age} • Sex: {sex}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          {/* Diagnosis Results Section */}
          <Box mb={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Diagnosis Results
            </Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip
                label={`HCV Status: ${hcvStatus}`}
                color={getStatusColor(hcvStatus)}
                size="medium"
              />
              <Chip
                label={`Risk Level: ${hcvRisk}`}
                color={getRiskColor(hcvRisk)}
                size="medium"
              />
              {hcvStage !== "N/A" && (
                <Chip label={`Stage: ${hcvStage}`} color="info" size="medium" />
              )}
            </Box>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Typography variant="body1">
                <strong>Confidence:</strong> {(confidence * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body1">
                <strong>HCV Status Probability:</strong>{" "}
                {(hcvStatusProbability * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} /> {/* Lab Values Section */}
          <Box mb={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Laboratory Values
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ALP
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {alp}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  AST
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {ast}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  CHE
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {che}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  CREA
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {crea}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  CGT
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {cgt}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ALB
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {alb}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  BIL
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {bil}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  CHOL
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {chol}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  PROT
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {prot}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ALT
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {alt}
                </Typography>
              </Box>
            </Box>
          </Box>{" "}
          <Divider sx={{ mb: 3 }} />
          {/* Symptoms Section */}
          {symptoms && symptoms.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                Symptoms
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {symptoms.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    variant="outlined"
                    color="secondary"
                    size="medium"
                  />
                ))}
              </Box>
            </Box>
          )}
          {symptoms && symptoms.length > 0 && <Divider sx={{ mb: 3 }} />}
          {/* Stage Predictions Section */}
          {Object.keys(stagePredictions).length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                Stage Predictions
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {Object.entries(stagePredictions).map(
                  ([stage, probability]) => (
                    <Chip
                      key={stage}
                      label={`${stage}: ${(probability * 100).toFixed(0)}%`}
                      variant="outlined"
                      color={probability > 0.5 ? "primary" : "default"}
                    />
                  )
                )}
              </Box>
            </Box>
          )}
          {Object.keys(stagePredictions).length > 0 && (
            <Divider sx={{ mb: 3 }} />
          )}
          {/* Recommendation Section */}
          {recommendation !== "N/A" && (
            <Box mb={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                AI Recommendation
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {recommendation}
              </Typography>
            </Box>
          )}
          {recommendation !== "N/A" && <Divider sx={{ mb: 3 }} />}
          {/* Metadata Section */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Diagnosis Information
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" mb={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Diagnosis ID
                </Typography>
                <Typography variant="body1">
                  {diagnosis?.id || "N/A"}
                </Typography>
              </Box>{" "}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1">
                  {diagnosis?.created_by || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
                <Chip
                  label={
                    diagnosis?.hcv_result?.diagnosis_completed ? "Yes" : "No"
                  }
                  color={
                    diagnosis?.hcv_result?.diagnosis_completed
                      ? "success"
                      : "warning"
                  }
                  size="small"
                />
              </Box>
            </Box>
            {createdAt && (
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(createdAt).toLocaleDateString()} at{" "}
                  {new Date(createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
          >
            Download Full Report
          </Button>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DiagnosisCard.propTypes = {
  diagnosis: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onArchive: PropTypes.func,
  onDownload: PropTypes.func,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  showActions: PropTypes.bool,
};

export default DiagnosisCard;
