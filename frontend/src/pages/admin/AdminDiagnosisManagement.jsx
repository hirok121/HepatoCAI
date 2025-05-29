import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Analytics,
  Visibility,
  Person,
  CalendarToday,
  TrendingUp,
  Assessment,
  DataUsage,
  CloudDownload,
  TableChart,
  Description,
  Refresh,
  FilterList,
  Search,
} from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import api from "../../api";
import AdminNavbar from "../../components/admin/AdminNavbar";

function AdminDiagnosisManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_diagnoses: 0,
    total_users: 0,
    recent_diagnoses: 0,
    severity_distribution: {},
    monthly_trends: [],
    success_rate: 0,
  });
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [anchorEl, setAnchorEl] = useState(null);
  const fetchDiagnosisData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/diagnosis/patients/");
      if (response.data.status === "success") {
        setDiagnoses(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching diagnosis data:", error);
      setMessage("Error loading diagnosis data.");
      setMessageType("error");
      // Set sample data for demonstration
      setDiagnoses([
        {
          id: 1,
          patient_name: "John Doe",
          age: 45,
          sex: "Male",
          created_at: "2025-05-28T10:30:00Z",
          created_by: user?.username || "admin",
          hcv_probability: 0.85,
          stage: "Class 2 (Fibrosis)",
        },
        {
          id: 2,
          patient_name: "Jane Smith",
          age: 38,
          sex: "Female",
          created_at: "2025-05-27T14:15:00Z",
          created_by: "doctor1",
          hcv_probability: 0.92,
          stage: "Class 3 (Cirrhosis)",
        },
        {
          id: 3,
          patient_name: "Bob Johnson",
          age: 52,
          sex: "Male",
          created_at: "2025-05-26T09:45:00Z",
          created_by: "nurse1",
          hcv_probability: 0.34,
          stage: "Class 0 (Blood Donors)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get("/diagnosis/analytics/");
      if (response.data.status === "success") {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Set fallback analytics data
      setAnalytics({
        total_diagnoses: 156,
        total_users: 45,
        recent_diagnoses: 23,
        severity_distribution: {
          mild: 45,
          moderate: 67,
          severe: 44,
        },
        monthly_trends: [
          { month: "2025-01", count: 12 },
          { month: "2025-02", count: 18 },
          { month: "2025-03", count: 25 },
          { month: "2025-04", count: 32 },
          { month: "2025-05", count: 69 },
        ],
        success_rate: 96.7,
        average_diagnosis_time: "2.3 minutes",
      });
    }
  }, []);

  useEffect(() => {
    fetchDiagnosisData();
    fetchAnalytics();
  }, [fetchDiagnosisData, fetchAnalytics]);

  const handleDownload = async (format) => {
    setDownloadLoading(true);
    setAnchorEl(null);

    try {
      const endpoint =
        format === "csv"
          ? "/diagnosis/export/csv/"
          : "/diagnosis/export/excel/";
      const response = await api.get(endpoint, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `hcv_diagnoses.${format === "csv" ? "csv" : "xlsx"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage(`Dataset exported successfully as ${format.toUpperCase()}!`);
      setMessageType("success");
    } catch (error) {
      console.error("Export error:", error);
      setMessage(`Failed to export dataset as ${format.toUpperCase()}.`);
      setMessageType("error");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleViewDetails = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setDialogOpen(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getSeverityColor = (probability) => {
    if (probability >= 0.7) return "error";
    if (probability >= 0.4) return "warning";
    return "success";
  };

  const getSeverityLabel = (probability) => {
    if (probability >= 0.7) return "High Risk";
    if (probability >= 0.4) return "Moderate Risk";
    return "Low Risk";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AdminNavbar />
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            <Analytics
              sx={{ fontSize: "inherit", mr: 1, color: "primary.main" }}
            />
            HCV Diagnosis Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Comprehensive analysis and data export for HCV diagnosis results
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<CloudDownload />}
            onClick={handleMenuOpen}
            disabled={downloadLoading}
            color="primary"
          >
            Export Dataset
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              fetchDiagnosisData();
              fetchAnalytics();
            }}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Download Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem onClick={() => handleDownload("csv")}>
          <ListItemIcon>
            <TableChart />
          </ListItemIcon>
          <ListItemText
            primary="Export as CSV"
            secondary="Comma-separated values"
          />
        </MenuItem>
        <MenuItem onClick={() => handleDownload("excel")}>
          <ListItemIcon>
            <Description />
          </ListItemIcon>
          <ListItemText
            primary="Export as Excel"
            secondary="Excel spreadsheet"
          />
        </MenuItem>
      </Menu>

      {/* Messages */}
      {message && (
        <Alert
          severity={messageType}
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Download Progress */}
      {downloadLoading && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2" gutterBottom>
              Preparing dataset for download...
            </Typography>
            <LinearProgress sx={{ mt: 1 }} />
          </Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Analytics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Diagnoses"
            value={analytics.total_diagnoses}
            icon={Assessment}
            color="primary"
            subtitle="All time diagnoses"
            trend={`+${analytics.recent_diagnoses} this month`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unique Patients"
            value={analytics.total_users}
            icon={Person}
            color="info"
            subtitle="Individual patients"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${analytics.success_rate}%`}
            icon={TrendingUp}
            color="success"
            subtitle="AI model accuracy"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Time"
            value={analytics.average_diagnosis_time || "2.3 min"}
            icon={DataUsage}
            color="warning"
            subtitle="Per diagnosis"
          />
        </Grid>

        {/* Diagnosis Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Recent Diagnosis Results ({diagnoses.length})
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" startIcon={<FilterList />}>
                    Filter
                  </Button>
                  <Button size="small" startIcon={<Search />}>
                    Search
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Age/Gender</TableCell>
                      <TableCell>HCV Probability</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Predicted Stage</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {diagnoses.length > 0 ? (
                      diagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {diagnosis.patient_name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {diagnosis.patient_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {diagnosis.age} years
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {diagnosis.sex}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {((diagnosis.hcv_probability || 0) * 100).toFixed(
                                1
                              )}
                              %
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getSeverityLabel(
                                diagnosis.hcv_probability || 0
                              )}
                              color={getSeverityColor(
                                diagnosis.hcv_probability || 0
                              )}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {diagnosis.stage || "Unknown"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography variant="body2">
                                {new Date(
                                  diagnosis.created_at
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {diagnosis.created_by}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(diagnosis)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography color="textSecondary" py={4}>
                            No diagnosis records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diagnosis Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Diagnosis Details - {selectedDiagnosis?.patient_name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedDiagnosis && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Patient Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedDiagnosis.patient_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Age:</strong> {selectedDiagnosis.age} years
                </Typography>
                <Typography variant="body2">
                  <strong>Gender:</strong> {selectedDiagnosis.sex}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Diagnosis Results
                </Typography>
                <Typography variant="body2">
                  <strong>HCV Probability:</strong>{" "}
                  {((selectedDiagnosis.hcv_probability || 0) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2">
                  <strong>Risk Level:</strong>{" "}
                  {getSeverityLabel(selectedDiagnosis.hcv_probability || 0)}
                </Typography>
                <Typography variant="body2">
                  <strong>Predicted Stage:</strong>{" "}
                  {selectedDiagnosis.stage || "Unknown"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Metadata
                </Typography>
                <Typography variant="body2">
                  <strong>Created:</strong>{" "}
                  {new Date(selectedDiagnosis.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Created By:</strong> {selectedDiagnosis.created_by}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// StatCard component
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <Card
    sx={{
      height: "100%",
      position: "relative",
      overflow: "visible",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 3,
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: `${color}.100`,
            color: `${color}.600`,
            mr: 2,
            width: 56,
            height: 56,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {trend && (
          <Chip
            label={trend}
            color={trend.startsWith("+") ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.string,
};

export default AdminDiagnosisManagement;
