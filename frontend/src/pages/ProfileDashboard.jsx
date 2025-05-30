import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Collapse,
} from "@mui/material";
import {
  Person,
  Timeline,
  Assessment,
  HealthAndSafety,
  TrendingUp,
  AccountCircle,
  History,
  Insights,
  Search,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import NavBar from "../components/layout/NavBar";
import DiagnosisSearch from "../components/diagnosis/DiagnosisSearch";
import DiagnosisList from "../components/diagnosis/DiagnosisList";
import { useUserAnalytics, useSearchDiagnoses } from "../hooks/useDiagnosis";
import { useAuth } from "../hooks/AuthContext";

const COLORS = {
  primary: "#1976d2",
  secondary: "#dc004e",
  warning: "#ed6c02",
  success: "#2e7d32",
  info: "#0288d1",
  error: "#d32f2f",
};

const ProfileDashboard = () => {
  const { user } = useAuth();
  const { data: analytics, isLoading, error } = useUserAnalytics(); // Search functionality state
  const [showSearch, setShowSearch] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  // Pagination state for DiagnosisList
  const [diagnosisPage, setDiagnosisPage] = useState(1);
  const [diagnosisPageSize, setDiagnosisPageSize] = useState(4);

  // Search diagnoses hook
  const { data: searchResults, isError: searchError } = useSearchDiagnoses({
    ...searchFilters,
    page: diagnosisPage,
    page_size: diagnosisPageSize,
  });

  // Pagination handlers for DiagnosisList
  const handleDiagnosisPageChange = (event, newPage) => {
    setDiagnosisPage(newPage);
  };

  const handleDiagnosisPageSizeChange = (event) => {
    setDiagnosisPageSize(event.target.value);
    setDiagnosisPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <NavBar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <NavBar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error">
            Failed to load analytics data. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  const analyticsData = analytics?.data || {};

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

  // Fix gender distribution issues
  // Debug and fix gender distribution data

  //   // Fix 1: Log the analytics data to see what we're actually getting
  //   console.log("Analytics data:", analyticsData);
  //   console.log("Gender distribution data:", analyticsData.gender_distribution);

  // Fix 2: More robust gender data preparation that handles different cases
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

  // Fix 3: More explicit check for gender data existence
  const hasGenderData =
    analyticsData.gender_distribution &&
    Object.values(analyticsData.gender_distribution).some((value) => value > 0);
  //   console.log("Has gender data:", hasGenderData);
  //   console.log("Gender distribution data prepared:", genderDistributionData);

  // Process monthly trends data - simplified like AdminDiagnosisManagement
  const monthlyTrendsData = analyticsData.monthly_trends || [];

  // Debug: Log monthly trends data to check if it's populated
  console.log("Monthly trends data:", monthlyTrendsData);

  // Check if we have any meaningful data (at least one non-zero value)
  const hasValidTrendsData =
    monthlyTrendsData.length > 0 &&
    monthlyTrendsData.some((item) => item.count > 0);

  // Prepare stage distribution data for bar chart
  const stageDistributionData = Object.entries(
    analyticsData.stage_distribution || {}
  ).map(([stage, count]) => {
    // Extract stage number and description for better display
    const stageNum = stage.match(/Class (\d+)/)?.[1] || "0";
    const stageDesc = stage.match(/\((.*?)\)/)?.[1] || "";

    return {
      name: `Class ${stageNum}`,
      fullName: stage,
      description: stageDesc,
      value: count,
      color: stage.includes("Class 0")
        ? COLORS.success
        : stage.includes("Class 1")
        ? COLORS.info
        : stage.includes("Class 2")
        ? COLORS.warning
        : COLORS.error,
    };
  });

  //   // Add debug logging for stage distribution
  //   console.log("Stage distribution raw data:", analyticsData.stage_distribution);
  //   console.log(
  //     "Stage distribution processed (all):",
  //     Object.entries(analyticsData.stage_distribution || {})
  //   );
  //   console.log("Stage distribution filtered (>0):", stageDistributionData);

  // Sort by stage number for consistent ordering
  stageDistributionData.sort((a, b) => {
    const aNum = parseInt(a.name.replace("Class ", ""));
    const bNum = parseInt(b.name.replace("Class ", ""));
    return aNum - bNum;
  });
  // Enhanced StatCard component with modern styling
  const StatCard = ({ title, value, icon, color = "primary", subtitle }) => (
    <Card
      sx={{
        height: "100%",
        minHeight: "140px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          "& .stat-icon": {
            transform: "scale(1.1)",
          },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          height="100%"
        >
          <Box flex={1}>
            <Typography
              variant="h4"
              color={`${color}.main`}
              fontWeight="bold"
              sx={{ mb: 0.5 }}
            >
              {value}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.primary"
              fontWeight="600"
              sx={{ mb: subtitle ? 0.5 : 0 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            className="stat-icon"
            sx={{
              bgcolor: `${color}.main`,
              width: 56,
              height: 56,
              boxShadow: `0 4px 12px ${
                color === "primary"
                  ? "rgba(25,118,210,0.3)"
                  : color === "success"
                  ? "rgba(46,125,50,0.3)"
                  : color === "info"
                  ? "rgba(2,136,209,0.3)"
                  : "rgba(237,108,2,0.3)"
              }`,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced ChartCard component with modern styling
  const ChartCard = ({ title, children, height = 250 }) => (
    <Card
      sx={{
        height: "100%",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          color="text.primary"
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Box height={height}>{children}</Box>
      </CardContent>
    </Card>
  );

  // PropTypes validation for StatCard
  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.element.isRequired,
    color: PropTypes.string,
    subtitle: PropTypes.string,
  };

  // PropTypes validation for ChartCard
  ChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    height: PropTypes.number,
  };
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <NavBar />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Enhanced Page Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            My Health Dashboard
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.1rem" }}
          >
            Personal diagnosis analytics for {user?.username || "User"}
          </Typography>
        </Box>

        {/* No Data State */}
        {analyticsData.total_diagnoses === 0 && (
          <Card
            sx={{
              mb: 4,
              p: 3,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 3,
            }}
          >
            <Alert
              severity="info"
              sx={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1rem",
              }}
            >
              No diagnosis records found. Create your first diagnosis to see
              your analytics.
            </Alert>
          </Card>
        )}

        {/* Main Content - Enhanced Layout */}
        {analyticsData.total_diagnoses > 0 && (
          <Box display="flex" flexDirection="column" gap={4}>
            {/* Overview & Analytics Section */}
            <Box>
              {/* Section Header */}
              <Card
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(25,118,210,0.3)",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="h5"
                    color="white"
                    fontWeight="bold"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <AccountCircle /> Overview & Analytics
                  </Typography>
                </CardContent>
              </Card>

              {/* Stats Cards Row */}
              <Box
                display="flex"
                flexWrap="wrap"
                gap={3}
                mb={4}
                sx={{
                  "& > *": {
                    flex: {
                      xs: "1 1 calc(50% - 12px)",
                      sm: "1 1 calc(25% - 18px)",
                    },
                    minWidth: { xs: "160px", sm: "180px" },
                  },
                }}
              >
                <StatCard
                  title="Total Diagnoses"
                  value={analyticsData.total_diagnoses}
                  icon={<Assessment />}
                  color="primary"
                />
                <StatCard
                  title="Recent Activity"
                  value={analyticsData.recent_diagnoses}
                  icon={<Timeline />}
                  color="info"
                  subtitle="Last 30 days"
                />
                <StatCard
                  title="Avg Confidence"
                  value={`${analyticsData.average_confidence}%`}
                  icon={<HealthAndSafety />}
                  color="success"
                />
                <StatCard
                  title="Frequency"
                  value={
                    analyticsData.health_insights?.diagnosis_frequency || "N/A"
                  }
                  icon={<Insights />}
                  color="warning"
                />
              </Box>

              {/* Charts Section */}
              <Box display="flex" flexDirection="column" gap={3}>
                {/* First Row - Primary Distribution Charts (3 columns) */}
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={3}
                  sx={{
                    "& > *": {
                      flex: {
                        xs: "1 1 100%",
                        sm: "1 1 calc(50% - 12px)",
                        lg: "1 1 calc(33.33% - 16px)",
                      },
                      minWidth: "300px",
                    },
                  }}
                >
                  <ChartCard title="Risk Level Distribution" height={240}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          dataKey="value"
                          label={({ name, value }) =>
                            value > 0 ? `${name}: ${value}` : ""
                          }
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="HCV Status Distribution" height={240}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hcvStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          dataKey="value"
                          label={({ name, value }) =>
                            value > 0 ? `${name}: ${value}` : ""
                          }
                        >
                          {hcvStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Gender Distribution" height={240}>
                    <ResponsiveContainer width="100%" height="100%">
                      {hasGenderData ? (
                        <PieChart>
                          <Pie
                            data={genderDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            innerRadius={40}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {genderDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                          flexDirection="column"
                          gap={1}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                          >
                            No gender data available
                          </Typography>
                        </Box>
                      )}
                    </ResponsiveContainer>
                  </ChartCard>
                </Box>

                {/* Second Row - Age and Stage Distribution (2 columns) */}
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={3}
                  sx={{
                    "& > *": {
                      flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" },
                      minWidth: "350px",
                    },
                  }}
                >
                  <ChartCard title="Age Distribution" height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ageDistributionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: "#e0e0e0" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: "#e0e0e0" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.95)",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill={COLORS.primary}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="HCV Stage Distribution" height={300}>
                    {stageDistributionData.length > 0 &&
                    stageDistributionData.some((item) => item.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stageDistributionData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "#e0e0e0" }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "#e0e0e0" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255,255,255,0.95)",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="value"
                            name="Count"
                            radius={[4, 4, 0, 0]}
                            isAnimationActive
                          >
                            {stageDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
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
                        <Alert
                          severity="info"
                          sx={{
                            width: "80%",
                            borderRadius: 2,
                            "& .MuiAlert-message": {
                              fontSize: "0.9rem",
                            },
                          }}
                        >
                          No stage distribution data available or all values are
                          zero.
                        </Alert>
                      </Box>
                    )}
                  </ChartCard>
                </Box>

                {/* Latest Diagnosis Card - Enhanced */}
                {analyticsData.latest_diagnosis && (
                  <Card
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 3,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
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
                            bgcolor: "info.main",
                            width: 32,
                            height: 32,
                            boxShadow: "0 4px 12px rgba(2,136,209,0.3)",
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          Latest Diagnosis
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        gap={1.5}
                        flexWrap="wrap"
                        alignItems="center"
                      >
                        <Chip
                          label={`${analyticsData.latest_diagnosis.patient_name}`}
                          icon={<Person />}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip
                          label={analyticsData.latest_diagnosis.hcv_status}
                          size="small"
                          color={
                            analyticsData.latest_diagnosis.hcv_status ===
                            "Positive"
                              ? "error"
                              : "success"
                          }
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip
                          label={analyticsData.latest_diagnosis.hcv_risk}
                          size="small"
                          color={
                            analyticsData.latest_diagnosis.hcv_risk === "High"
                              ? "error"
                              : analyticsData.latest_diagnosis.hcv_risk ===
                                "Medium"
                              ? "warning"
                              : "success"
                          }
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip
                          label={`${(
                            analyticsData.latest_diagnosis.confidence * 100
                          ).toFixed(1)}% confidence`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            ml: "auto",
                            fontStyle: "italic",
                          }}
                        >
                          {new Date(
                            analyticsData.latest_diagnosis.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
            {/* Search Section */}
            <Card
              sx={{
                mb: 3,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 100%)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgba(25,118,210,0.15) 0%, rgba(25,118,210,0.08) 100%)",
                  },
                }}
                onClick={() => setShowSearch(!showSearch)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 32,
                      height: 32,
                      boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
                    }}
                  >
                    <Search fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Search Your Diagnosis Records
                  </Typography>
                </Box>
                {showSearch ? <ExpandLess /> : <ExpandMore />}
              </Box>

              <Collapse in={showSearch}>
                <Box sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
                  {" "}
                  <DiagnosisSearch
                    onFiltersChange={(filters) => {
                      setSearchFilters(filters);
                    }}
                    initialFilters={searchFilters}
                  />
                  {searchError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Error searching diagnoses. Please try again.
                    </Alert>
                  )}{" "}
                  {searchResults && (
                    <Box sx={{ mt: 3 }}>
                      {" "}
                      <Box mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                          Search Results (
                          {searchResults.data?.pagination?.count || 0})
                        </Typography>
                      </Box>{" "}
                      <DiagnosisList
                        searchResults={searchResults}
                        filters={searchFilters}
                        showTitle={false}
                        allowSelection={false}
                        pagination={searchResults?.data?.pagination}
                        onPageChange={handleDiagnosisPageChange}
                        onPageSizeChange={handleDiagnosisPageSizeChange}
                        currentPage={diagnosisPage}
                        pageSize={diagnosisPageSize}
                      />
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Card>{" "}
            {/* Trends & History Section - Flex Layout */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={3}
              mb={3}
              sx={{
                "& > *:first-child": {
                  flex: { xs: "1 1 100%", lg: "1 1 calc(60% - 12px)" },
                  height: { lg: "500px" }, // Set fixed height for consistent sizing
                },
                "& > *:last-child": {
                  flex: { xs: "1 1 100%", lg: "1 1 calc(40% - 12px)" },
                  height: { lg: "500px" }, // Same height for both cards
                },
              }}
            >
              {/* Monthly Trends - 60% width */}
              <Box
                sx={{
                  minWidth: "350px",
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
                        Monthly Diagnosis Trends
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
                        Trend Insights
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
                            <strong>Risk Pattern:</strong>{" "}
                            {analyticsData.health_insights?.most_common_risk ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* new trends end */}

              {/* History Card */}
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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
                      History Summary
                    </Typography>
                  </Box>

                  <Typography variant="body2" paragraph color="text.secondary">
                    Comprehensive overview of your diagnosis history and
                    patterns.
                  </Typography>

                  <Box mb={3} sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="bold"
                    >
                      Quick Statistics
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">Total Diagnoses</Typography>
                        <Chip
                          label={analyticsData.total_diagnoses}
                          color="primary"
                          size="small"
                        />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">Recent Activity</Typography>
                        <Chip
                          label={`${analyticsData.recent_diagnoses} (30d)`}
                          color="info"
                          size="small"
                        />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">Avg Confidence</Typography>
                        <Chip
                          label={`${analyticsData.average_confidence}%`}
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">Frequency</Typography>
                        <Chip
                          label={
                            analyticsData.health_insights
                              ?.diagnosis_frequency || "N/A"
                          }
                          color="warning"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Alert severity="info" sx={{ fontSize: "0.85rem" }}>
                    Visit the diagnosis page for detailed individual records and
                    complete history.
                  </Alert>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProfileDashboard;
