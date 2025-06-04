import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Assessment,
  FileDownload,
  AdminPanelSettings,
  Timeline,
  HealthAndSafety,
  Group,
  Search,
  TrendingUp,
  History,
  Insights,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useAdminAnalytics } from "../../hooks/useAnalytics";
import { useAdminSearchDiagnoses } from "../../hooks/useDiagnosis";
import AdminNavbar from "../../components/admin/AdminNavbar";
import DiagnosisSearch from "../../components/diagnosis/DiagnosisSearch";
import DiagnosisTable from "../../components/diagnosis/DiagnosisTable";
import { diagnosisAPI } from "../../services/diagnosisAPI";

const COLORS = {
  primary: "#1976d2",
  secondary: "#dc004e",
  warning: "#ed6c02",
  success: "#2e7d32",
  info: "#0288d1",
  error: "#d32f2f",
};

function AdminDiagnosisManagement() {
  const { data: analytics, isLoading, error } = useAdminAnalytics();

  // Search functionality state
  const [showSearch, setShowSearch] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchPageSize, setSearchPageSize] = useState(25);

  // Export menu state
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const openExportMenu = Boolean(exportAnchorEl);

  // Prepare search filters with pagination
  const searchFiltersWithPagination = useMemo(() => {
    if (Object.keys(searchFilters).length === 0) return {};
    return {
      ...searchFilters,
      page: searchPage,
      page_size: searchPageSize,
    };
  }, [searchFilters, searchPage, searchPageSize]);
  // Search diagnoses hook
  const { data: searchResults, isError: searchError } = useAdminSearchDiagnoses(
    searchFiltersWithPagination
  );

  const analyticsData = useMemo(() => analytics?.data || {}, [analytics?.data]);

  // Pagination handlers for search
  const handleSearchPageChange = (event, newPage) => {
    setSearchPage(newPage);
  };

  const handleSearchPageSizeChange = (event) => {
    setSearchPageSize(parseInt(event.target.value, 10));
    setSearchPage(1); // Reset to first page when changing page size
  };

  const handleExportAll = async (format = "excel") => {
    try {
      let response;
      let filename;

      if (format === "csv") {
        response = await diagnosisAPI.exportCSV();
        filename = `diagnosis_records_${
          new Date().toISOString().split("T")[0]
        }.csv`;
      } else if (format === "excel") {
        response = await diagnosisAPI.exportExcel();
        filename = `diagnosis_records_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
      } else if (format === "analytics") {
        // Create comprehensive analytics export
        const exportData = {
          export_info: {
            generated_at: new Date().toISOString(),
            export_type: "Admin Analytics Export",
            description: "Comprehensive system analytics and diagnosis data",
          },
          analytics_summary: analyticsData || {},
          system_health: analyticsData.system_health || {},
          model_performance: analyticsData.model_performance || {},
          age_analysis: analyticsData.age_analysis || {},
          top_users: analyticsData.top_users || [],
          monthly_trends: analyticsData.monthly_trends || [],
          weekly_trends: analyticsData.weekly_trends || [],
          search_results: searchResults || {},
          distribution_data: {
            risk_distribution: analyticsData.risk_distribution || {},
            hcv_status_distribution:
              analyticsData.hcv_status_distribution || {},
            stage_distribution: analyticsData.stage_distribution || {},
            gender_distribution: analyticsData.gender_distribution || {},
            age_distribution: analyticsData.age_distribution || {},
          },
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `admin_analytics_export_${
          new Date().toISOString().split("T")[0]
        }.json`;
        link.click();
        URL.revokeObjectURL(url);

        setExportAnchorEl(null);
        return;
      }

      // Create download link for CSV/Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // You could add a toast notification here
    } finally {
      setExportAnchorEl(null); // Close the menu
    }
  };

  const handleExportMenuClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  // Prepare chart data
  const riskDistributionData = [
    {
      name: "High Risk",
      value: analyticsData.risk_distribution?.high_risk || 0,
      color: COLORS.error,
    },
    {
      name: "Medium Risk",
      value: analyticsData.risk_distribution?.medium_risk || 0,
      color: COLORS.warning,
    },
    {
      name: "Low Risk",
      value: analyticsData.risk_distribution?.low_risk || 0,
      color: COLORS.success,
    },
  ];
  const hcvStatusData = [
    {
      name: "Positive",
      value: analyticsData.hcv_status_distribution?.positive || 0,
      color: COLORS.error,
    },
    {
      name: "Negative",
      value: analyticsData.hcv_status_distribution?.negative || 0,
      color: COLORS.success,
    },
  ];

  const ageDistributionData = [
    { name: "Young (<30)", value: analyticsData.age_distribution?.young || 0 },
    {
      name: "Middle (30-60)",
      value: analyticsData.age_distribution?.middle || 0,
    },
    { name: "Elder (60+)", value: analyticsData.age_distribution?.elder || 0 },
  ];

  // Gender distribution data with robust handling
  const genderDistributionData = [
    {
      name: "Male",
      value:
        analyticsData.gender_distribution?.male ||
        analyticsData.gender_distribution?.Male ||
        0,
      color: COLORS.info,
    },
    {
      name: "Female",
      value:
        analyticsData.gender_distribution?.female ||
        analyticsData.gender_distribution?.Female ||
        0,
      color: COLORS.secondary,
    },
  ].filter((item) => item.value > 0);

  const hasGenderData =
    analyticsData.gender_distribution &&
    Object.values(analyticsData.gender_distribution).some((value) => value > 0);

  const monthlyTrendsData = analyticsData.monthly_trends || [];

  const stageDistributionData = Object.entries(
    analyticsData.stage_distribution || {}
  ).map(([stage, count]) => ({
    name: stage,
    value: count,
    color: stage.toLowerCase().includes("cirrhosis")
      ? COLORS.error
      : stage.toLowerCase().includes("fibrosis")
      ? COLORS.warning
      : stage.toLowerCase().includes("hepatitis")
      ? COLORS.info
      : stage.toLowerCase().includes("blood donors")
      ? COLORS.success
      : COLORS.primary, // fallback color
  }));

  // Component definitions
  const AdminStatCard = ({
    title,
    value,
    icon,
    color = "primary",
    subtitle,
  }) => (
    <Card sx={{ height: "100%", minHeight: "120px" }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" color={color} fontWeight="bold">
              {value}
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight="medium"
            >
              {title}
            </Typography>{" "}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 40, height: 40 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  AdminStatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.element.isRequired,
    color: PropTypes.string,
    subtitle: PropTypes.string,
  };

  const ChartCard = ({ title, children, height = 300 }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Box height={height}>{children}</Box>
      </CardContent>
    </Card>
  );

  ChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    height: PropTypes.number,
  };

  if (isLoading) {
    return (
      <Box>
        <AdminNavbar />
        <Box sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <AdminNavbar />
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Error loading admin analytics: {error.message}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <AdminNavbar />
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Admin Diagnosis Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive diagnosis analytics and management for
                administrators
              </Typography>
            </Box>{" "}
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleExportMenuClick}
              sx={{ minWidth: 150 }}
            >
              Export Data
            </Button>{" "}
            <Menu
              anchorEl={exportAnchorEl}
              open={openExportMenu}
              onClose={handleExportMenuClose}
              MenuListProps={{
                "aria-labelledby": "export-button",
              }}
            >
              <MenuItem onClick={() => handleExportAll("excel")}>
                Export Diagnosis Records as Excel (.xlsx)
              </MenuItem>
              <MenuItem onClick={() => handleExportAll("csv")}>
                Export Diagnosis Records as CSV (.csv)
              </MenuItem>
              <MenuItem onClick={() => handleExportAll("analytics")}>
                Export Analytics Data as JSON (.json)
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* No data alert */}
        {analyticsData.total_diagnoses === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No diagnosis records found in the system. Analytics will be
            available once diagnoses are created.
          </Alert>
        )}

        {/* Main content when data exists */}
        {analyticsData.total_diagnoses > 0 && (
          <Box>
            {/* Overview Section */}
            <Box mb={4}>
              <Paper sx={{ p: 1.5, mb: 2, bgcolor: "primary.main" }}>
                <Typography
                  variant="h6"
                  color="white"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AdminPanelSettings fontSize="small" /> System Overview &
                  Analytics{" "}
                </Typography>
              </Paper>

              {/* Enhanced Admin Stats Flex Layout */}
              <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                mb={3}
                sx={{
                  "& > *": {
                    flex: {
                      xs: "1 1 calc(50% - 8px)",
                      sm: "1 1 calc(25% - 12px)",
                    },
                    minWidth: "200px",
                  },
                }}
              >
                <AdminStatCard
                  title="Total Diagnoses"
                  value={analyticsData.total_diagnoses || 0}
                  icon={<Assessment />}
                  color="primary"
                />
                <AdminStatCard
                  title="Total Users"
                  value={analyticsData.total_users || 0}
                  icon={<Group />}
                  color="info"
                />
                <AdminStatCard
                  title="Recent Activity"
                  value={analyticsData.recent_diagnoses || 0}
                  icon={<Timeline />}
                  color="warning"
                  subtitle="Last 30 days"
                />
                <AdminStatCard
                  title="System Confidence"
                  value={`${analyticsData.average_confidence || 0}%`}
                  icon={<HealthAndSafety />}
                  color="success"
                />
              </Box>

              {/* Additional System Health & Performance Stats */}
              <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                mb={3}
                sx={{
                  "& > *": {
                    flex: {
                      xs: "1 1 calc(50% - 8px)",
                      sm: "1 1 calc(25% - 12px)",
                    },
                    minWidth: "200px",
                  },
                }}
              >
                <AdminStatCard
                  title="Average Age"
                  value={`${
                    analyticsData.age_analysis?.average_age || 0
                  } years`}
                  icon={<Person />}
                  color="secondary"
                />
                <AdminStatCard
                  title="Model Accuracy"
                  value={analyticsData.model_performance?.accuracy || "N/A"}
                  icon={<Insights />}
                  color="success"
                />
                <AdminStatCard
                  title="System Uptime"
                  value={analyticsData.system_health?.system_uptime || "N/A"}
                  icon={<TrendingUp />}
                  color="info"
                />
                <AdminStatCard
                  title="Avg Diagnosis Time"
                  value={
                    analyticsData.system_health?.average_diagnosis_time || "N/A"
                  }
                  icon={<History />}
                  color="warning"
                />
              </Box>

              {/* Enhanced Charts Flex Layout with All Chart Types */}
              <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                {/* three binary distribution  */}
                <Box display="flex " gap={2} width="100%">
                  {/* Risk Level Distribution */}
                  <Box
                    sx={{
                      flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      minWidth: "300px",
                    }}
                  >
                    <ChartCard title="Risk Level Distribution" height={200}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) =>
                              value > 0 ? `${name}: ${value}` : ""
                            }
                          >
                            {riskDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </Box>

                  {/* HCV Status Distribution */}
                  <Box
                    sx={{
                      flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      minWidth: "300px",
                    }}
                  >
                    <ChartCard title="HCV Status Distribution" height={200}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={hcvStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) =>
                              value > 0 ? `${name}: ${value}` : ""
                            }
                          >
                            {hcvStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </Box>

                  {/* Gender Distribution */}
                  <Box
                    sx={{
                      flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      minWidth: "300px",
                    }}
                  >
                    <ChartCard title="Gender Distribution" height={200}>
                      <ResponsiveContainer width="100%" height="100%">
                        {hasGenderData ? (
                          <PieChart>
                            <Pie
                              data={genderDistributionData}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              innerRadius={30}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {genderDistributionData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        ) : (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                          >
                            <Typography variant="body2" color="text.secondary">
                              No gender data available
                            </Typography>
                          </Box>
                        )}
                      </ResponsiveContainer>
                    </ChartCard>
                  </Box>
                </Box>
                <Box display="flex" gap={2} width="100%">
                  {/* Age Distribution */}
                  <Box
                    sx={{
                      flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      minWidth: "300px",
                    }}
                  >
                    <ChartCard title="Age Distribution" height={200}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageDistributionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill={COLORS.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </Box>

                  {/* Stage Distribution - Full Width */}
                  <Box sx={{ flex: "1 1 100%", minWidth: "300px" }}>
                    <ChartCard title="HCV Stage Distribution" height={250}>
                      {stageDistributionData ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stageDistributionData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar
                              dataKey="value"
                              name="Count"
                              isAnimationActive
                              label={{ position: "top" }}
                            >
                              {stageDistributionData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                          flexDirection="column"
                          gap={2}
                        >
                          <Alert severity="info" sx={{ width: "80%" }}>
                            No stage distribution data available or all values
                            are zero.
                          </Alert>
                        </Box>
                      )}
                    </ChartCard>
                  </Box>
                </Box>{" "}
                {/* Top Users List */}
                {analyticsData.top_users &&
                  analyticsData.top_users.length > 0 && (
                    <Box sx={{ flex: "1 1 100%", minWidth: "300px" }}>
                      <Card
                        sx={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            mb={2.5}
                            sx={{
                              borderBottom: "1px solid #e0e0e0",
                              pb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 32,
                                height: 32,
                                color: "white",
                              }}
                            >
                              <Person fontSize="small" />
                            </Avatar>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="text.primary"
                              sx={{ flex: 1 }}
                            >
                              Top Active Users ({analyticsData.top_users.length}
                              )
                            </Typography>
                            <Chip
                              label="USER RANKING"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>

                          <Box display="flex" flexDirection="column" gap={2}>
                            {analyticsData.top_users.map((user, index) => (
                              <Box
                                key={index}
                                sx={{
                                  p: 2,
                                  border: "1px solid #f0f0f0",
                                  borderRadius: 1,
                                  backgroundColor:
                                    index === 0 ? "#f8f9fa" : "white",
                                  "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={1}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <Chip
                                      label={`#${index + 1}`}
                                      size="small"
                                      color={
                                        index === 0 ? "warning" : "default"
                                      }
                                      sx={{ minWidth: "40px" }}
                                    />
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight="bold"
                                      color="text.primary"
                                    >
                                      {`${
                                        user.created_by__first_name || "User"
                                      } ${user.created_by__last_name || ""}`}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={`${user.diagnosis_count} diagnoses`}
                                    size="small"
                                    color="success"
                                    variant="filled"
                                  />
                                </Box>

                                <Box
                                  display="flex"
                                  gap={1}
                                  flexWrap="wrap"
                                  alignItems="center"
                                >
                                  <Chip
                                    icon={<Person />}
                                    label={user.created_by__email}
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    sx={{
                                      maxWidth: "250px",
                                      "& .MuiChip-label": {
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      },
                                    }}
                                  />
                                  {index === 0 && (
                                    <Chip
                                      icon={<TrendingUp />}
                                      label="Top Contributor"
                                      size="small"
                                      color="warning"
                                      variant="filled"
                                    />
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>

                          <Box
                            mt={2}
                            pt={2}
                            sx={{
                              borderTop: "1px solid #e0e0e0",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Users ranked by total diagnosis contributions to
                              the system
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
              </Box>
            </Box>

            {/* Search Section */}
            <Paper sx={{ mb: 3 }}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "grey.50" },
                }}
                onClick={() => setShowSearch(!showSearch)}
              >
                {" "}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Search color="primary" />
                  <Typography variant="h6">
                    Search System Diagnosis Records
                  </Typography>
                  {hasActiveFilters && (
                    <Chip
                      label="Active Filters"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                {showSearch ? <ExpandLess /> : <ExpandMore />}
              </Box>

              <Collapse in={showSearch}>
                <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                  {" "}
                  <DiagnosisSearch
                    onFiltersChange={(filters) => {
                      setSearchFilters(filters);
                      setSearchPage(1); // Reset to first page when filters change
                      const hasFilters = Object.keys(filters).some(
                        (key) =>
                          filters[key] &&
                          filters[key] !== "" &&
                          filters[key] !== false &&
                          !(key === "min_confidence" && filters[key] === 0) &&
                          !(key === "max_confidence" && filters[key] === 1)
                      );
                      setHasActiveFilters(hasFilters);
                      setShowSearchResults(hasFilters);
                    }}
                    initialFilters={searchFilters}
                  />
                  {searchError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Error searching diagnoses. Please try again.
                    </Alert>
                  )}{" "}
                  {searchResults &&
                    (showSearchResults ||
                      searchResults.data?.results?.length > 0) && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Search Results (
                          {searchResults.data?.pagination?.count ||
                            searchResults.data?.results?.length ||
                            0}
                          )
                        </Typography>{" "}
                        {searchResults.data?.results?.length > 0 ? (
                          <DiagnosisTable
                            diagnoses={searchResults.data.results}
                            allowSelection={false}
                            pagination={searchResults.data?.pagination}
                            onPageChange={handleSearchPageChange}
                            onPageSizeChange={handleSearchPageSizeChange}
                            currentPage={searchPage}
                            pageSize={searchPageSize}
                          />
                        ) : (
                          <Alert severity="info">
                            No results found for the current search criteria.
                          </Alert>
                        )}
                      </Box>
                    )}
                </Box>
              </Collapse>
            </Paper>

            {/* Enhanced Statistics & Trends Section */}
            <Box display="flex" flexWrap="wrap" gap={3} mb={3}>
              {/* Trends Card */}
              <Box
                sx={{
                  flex: { xs: "1 1 100%", lg: "1 1 calc(70% - 12px)" },
                  minWidth: "400px",
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={2}
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pb: 2,
                      }}
                    >
                      <Avatar
                        sx={{ bgcolor: "success.main", width: 40, height: 40 }}
                      >
                        <TrendingUp />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        System-wide Diagnosis Trends
                      </Typography>
                    </Box>

                    <Box height={280}>
                      {monthlyTrendsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyTrendsData.slice().reverse()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <RechartsTooltip />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke={COLORS.primary}
                              strokeWidth={3}
                              dot={{ fill: COLORS.primary, r: 5 }}
                              activeDot={{ r: 7 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                        >
                          <Alert severity="info" sx={{ width: "80%" }}>
                            No monthly trends data available.
                          </Alert>
                        </Box>
                      )}
                    </Box>

                    <Box
                      mt={2}
                      pt={2}
                      sx={{ borderTop: 1, borderColor: "divider" }}
                    >
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight="bold"
                      >
                        System-wide Insights
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box
                          sx={{
                            flex: "1 1 calc(50% - 8px)",
                            minWidth: "120px",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Total:</strong>{" "}
                            {analyticsData.total_diagnoses || 0} diagnoses
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: "1 1 calc(50% - 8px)",
                            minWidth: "120px",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Recent:</strong>{" "}
                            {analyticsData.recent_diagnoses || 0} (30 days)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: "1 1 calc(50% - 8px)",
                            minWidth: "120px",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Avg Confidence:</strong>{" "}
                            {analyticsData.average_confidence || 0}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: "1 1 calc(50% - 8px)",
                            minWidth: "120px",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Active Users:</strong>{" "}
                            {analyticsData.total_users || "N/A"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: "1 1 calc(50% - 8px)",
                            minWidth: "120px",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Age Range:</strong>{" "}
                            {analyticsData.age_analysis?.min_age || 0}-
                            {analyticsData.age_analysis?.max_age || 0} years
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: "1 1 calc(50% - 8px)",
                            minWidth: "120px",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Model Accuracy:</strong>{" "}
                            {analyticsData.model_performance?.accuracy || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Admin Summary Card */}
              <Box
                sx={{
                  flex: { xs: "1 1 100%", lg: "1 1 calc(30% - 12px)" },
                  minWidth: "300px",
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={2}
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "secondary.main",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <History />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        Admin Overview
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      paragraph
                      color="text.secondary"
                    >
                      Comprehensive system overview with administrative insights
                      and analytics.
                    </Typography>
                    <Box mb={3}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight="bold"
                      >
                        System Statistics
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">
                            Total Diagnoses
                          </Typography>
                          <Chip
                            label={analyticsData.total_diagnoses || 0}
                            color="primary"
                            size="small"
                          />
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">
                            Recent Activity
                          </Typography>
                          <Chip
                            label={`${
                              analyticsData.recent_diagnoses || 0
                            } (30d)`}
                            color="info"
                            size="small"
                          />
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">
                            System Confidence
                          </Typography>
                          <Chip
                            label={`${analyticsData.average_confidence || 0}%`}
                            color="success"
                            size="small"
                          />
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">Active Users</Typography>
                          <Chip
                            label={analyticsData.total_users || "N/A"}
                            color="warning"
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Alert severity="info" sx={{ fontSize: "0.85rem" }}>
                      Use the search functionality above to filter and analyze
                      specific diagnosis records.
                    </Alert>{" "}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminDiagnosisManagement;
