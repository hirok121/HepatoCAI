import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  TablePagination,
} from "@mui/material";
import { Person, Download, CalendarToday, Close } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const DiagnosisTable = ({
  diagnoses,
  allowSelection = false,
  selectedDiagnoses = [],
  onSelect,
  onSelectAll,
}) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRowClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedDiagnosis(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page data
  const paginatedDiagnoses = diagnoses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle download functionality (copied from DiagnosisCard)
  const handleDownload = (diagnosis) => {
    const reportData = diagnosis;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagnosis_${diagnosis.patient_name}_${Date.now()}.json`;
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

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const isAllSelected =
    selectedDiagnoses.length === diagnoses.length && diagnoses.length > 0;
  const isIndeterminate =
    selectedDiagnoses.length > 0 && selectedDiagnoses.length < diagnoses.length;
  return (
    <Paper sx={{ width: "100%", mt: 2 }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {allowSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={onSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>Patient</TableCell>
              <TableCell>Age/Sex</TableCell>
              <TableCell>HCV Status</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Lab Values</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDiagnoses.map((diagnosis) => (
              <TableRow
                key={diagnosis.id}
                hover
                onClick={() => handleRowClick(diagnosis)}
                sx={{
                  opacity: diagnosis.is_archived ? 0.7 : 1,
                  backgroundColor: selectedDiagnoses.includes(diagnosis.id)
                    ? "action.selected"
                    : "inherit",
                  cursor: "pointer",
                }}
              >
                {allowSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDiagnoses.includes(diagnosis.id)}
                      onChange={() => onSelect?.(diagnosis.id)}
                    />
                  </TableCell>
                )}
                {/* Patient */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      <Person fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {diagnosis.patient_name}
                    </Typography>
                  </Box>
                </TableCell>
                {/* Age/Sex */}
                <TableCell>
                  <Typography variant="body2">
                    {diagnosis.age} • {diagnosis.sex}
                  </Typography>
                </TableCell>{" "}
                {/* HCV Status */}
                <TableCell>
                  <Chip
                    label={diagnosis.hcv_result?.hcv_status || "Unknown"}
                    color={getStatusColor(diagnosis.hcv_result?.hcv_status)}
                    size="small"
                  />
                </TableCell>
                {/* Risk Level */}
                <TableCell>
                  <Chip
                    label={diagnosis.hcv_result?.hcv_risk || "Unknown"}
                    color={getRiskColor(diagnosis.hcv_result?.hcv_risk)}
                    size="small"
                  />
                </TableCell>
                {/* Stage */}
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                    {diagnosis.hcv_result?.hcv_stage || "Unknown"}
                  </Typography>
                </TableCell>
                {/* Confidence */}
                <TableCell>
                  <Box sx={{ width: 100 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(diagnosis.hcv_result?.confidence || 0) * 100}
                        sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                      />
                      <Typography variant="caption" fontWeight="bold">
                        {(
                          (diagnosis.hcv_result?.confidence || 0) * 100
                        ).toFixed(0)}
                        %
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                {/* Lab Values */}
                <TableCell>
                  <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                    <div>
                      ALP: {diagnosis.alp} | AST: {diagnosis.ast}
                    </div>
                    <div>
                      CHE: {diagnosis.che} | CREA: {diagnosis.crea}
                    </div>
                    <div>CGT: {diagnosis.cgt}</div>
                  </Box>
                </TableCell>
                {/* Created */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(diagnosis.created_at)}
                  </Typography>
                  {diagnosis.is_archived && (
                    <Chip
                      label="Archived"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>{" "}
                {/* Actions */}
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(diagnosis);
                    }}
                  >
                    <Download />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detailed View Dialog - same as DiagnosisCard */}
      {selectedDiagnosis && (
        <Dialog
          open={openDetail}
          onClose={handleCloseDetail}
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
                Diagnosis Details - {selectedDiagnosis.patient_name}
              </Typography>
              <Button onClick={handleCloseDetail} size="small">
                <Close />
              </Button>
            </Box>
          </DialogTitle>
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
                  <Typography variant="h6">
                    {selectedDiagnosis.patient_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Age: {selectedDiagnosis.age} • Sex: {selectedDiagnosis.sex}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {/* Diagnosis Results Section */}
            <Box mb={3}>
              <Typography variant="h6" color="primary" gutterBottom>
                Diagnosis Results
              </Typography>{" "}
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Chip
                  label={`HCV Status: ${
                    selectedDiagnosis.hcv_result?.hcv_status || "Unknown"
                  }`}
                  color={getStatusColor(
                    selectedDiagnosis.hcv_result?.hcv_status
                  )}
                  size="medium"
                />
                <Chip
                  label={`Risk Level: ${
                    selectedDiagnosis.hcv_result?.hcv_risk || "Unknown"
                  }`}
                  color={getRiskColor(selectedDiagnosis.hcv_result?.hcv_risk)}
                  size="medium"
                />
                {selectedDiagnosis.hcv_result?.hcv_stage && (
                  <Chip
                    label={`Stage: ${selectedDiagnosis.hcv_result.hcv_stage}`}
                    color="info"
                    size="medium"
                  />
                )}
              </Box>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Typography variant="body1">
                  <strong>Confidence:</strong>{" "}
                  {(
                    (selectedDiagnosis.hcv_result?.confidence || 0) * 100
                  ).toFixed(1)}
                  %
                </Typography>
                <Typography variant="body1">
                  <strong>HCV Status Probability:</strong>{" "}
                  {(
                    (selectedDiagnosis.hcv_result?.hcv_status_probability ||
                      0) * 100
                  ).toFixed(1)}
                  %
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {/* Lab Values Section */}
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
                    {selectedDiagnosis.alp || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    AST
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.ast || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    CHE
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.che || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    CREA
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.crea || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    CGT
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.cgt || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ALB
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.alb || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    BIL
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.bil || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    CHOL
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.chol || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    PROT
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.prot || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ALT
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDiagnosis.alt || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Symptoms Section */}
            {selectedDiagnosis.symptoms &&
              selectedDiagnosis.symptoms.length > 0 && (
                <Box mb={3}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" color="primary" gutterBottom>
                    Symptoms
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedDiagnosis.symptoms.map((symptom, index) => (
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
            {/* Stage Predictions Section */}
            <Divider sx={{ mb: 3 }} />
            {selectedDiagnosis.hcv_result?.hcv_stage_probability &&
              Object.keys(selectedDiagnosis.hcv_result.hcv_stage_probability)
                .length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Stage Predictions
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {Object.entries(
                      selectedDiagnosis.hcv_result.hcv_stage_probability
                    ).map(([stage, probability]) => (
                      <Chip
                        key={stage}
                        label={`${stage}: ${(probability * 100).toFixed(0)}%`}
                        variant="outlined"
                        color={probability > 0.5 ? "primary" : "default"}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            {selectedDiagnosis.hcv_result?.hcv_stage_probability &&
              Object.keys(selectedDiagnosis.hcv_result.hcv_stage_probability)
                .length > 0 && <Divider sx={{ mb: 3 }} />}
            {/* Recommendation Section */}
            {selectedDiagnosis.hcv_result?.recommendation &&
              selectedDiagnosis.hcv_result.recommendation !== "N/A" && (
                <Box mb={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    AI Recommendation
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {selectedDiagnosis.hcv_result.recommendation}
                  </Typography>
                </Box>
              )}
            {selectedDiagnosis.hcv_result?.recommendation &&
              selectedDiagnosis.hcv_result.recommendation !== "N/A" && (
                <Divider sx={{ mb: 3 }} />
              )}
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
                    {selectedDiagnosis.id || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body1">
                    {selectedDiagnosis.created_by || "N/A"}
                  </Typography>
                </Box>{" "}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Chip
                    label={
                      selectedDiagnosis.hcv_result?.diagnosis_completed
                        ? "Yes"
                        : "No"
                    }
                    color={
                      selectedDiagnosis.hcv_result?.diagnosis_completed
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </Box>
              </Box>
              {selectedDiagnosis.created_at && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Created:{" "}
                    {new Date(
                      selectedDiagnosis.created_at
                    ).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(
                      selectedDiagnosis.created_at
                    ).toLocaleTimeString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => handleDownload(selectedDiagnosis)}
            >
              Download Full Report
            </Button>
            <Button onClick={handleCloseDetail}>Close</Button>{" "}
          </DialogActions>
        </Dialog>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={diagnoses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

DiagnosisTable.propTypes = {
  diagnoses: PropTypes.array.isRequired,
  onDownload: PropTypes.func,
  allowSelection: PropTypes.bool,
  selectedDiagnoses: PropTypes.array,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
};

export default DiagnosisTable;
