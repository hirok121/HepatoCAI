import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BarChart,
  TrendingUp,
  Analytics,
  Assessment,
  Refresh,
  Timeline,
  PieChart,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/AuthContext";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

function AdminAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    diagnosisStats: [],
    systemUsage: [],
    topFeatures: [],
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call for analytics data
      setTimeout(() => {
        setAnalyticsData({
          userGrowth: [
            { date: "2025-05-21", users: 150 },
            { date: "2025-05-22", users: 165 },
            { date: "2025-05-23", users: 172 },
            { date: "2025-05-24", users: 180 },
            { date: "2025-05-25", users: 195 },
            { date: "2025-05-26", users: 203 },
            { date: "2025-05-27", users: 218 },
          ],
          diagnosisStats: [
            { type: "HCV Diagnosis", count: 45, percentage: 35 },
            { type: "Risk Assessment", count: 32, percentage: 25 },
            { type: "Stage Prediction", count: 28, percentage: 22 },
            { type: "Treatment Recommendations", count: 23, percentage: 18 },
          ],
          systemUsage: {
            avgResponseTime: "1.2s",
            uptime: "99.8%",
            apiCalls: 12543,
            errorRate: "0.2%",
          },
          topFeatures: [
            { feature: "Diagnosis Tool", usage: 78 },
            { feature: "AI Assistant", usage: 65 },
            { feature: "Patient Education", usage: 52 },
            { feature: "Research Papers", usage: 34 },
            { feature: "Community Forum", usage: 28 },
          ],
        });
        setLoading(false);
        setMessage("Analytics data loaded successfully");
        setMessageType("success");
      }, 1000);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setMessage("Failed to load analytics data");
      setMessageType("error");
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ color: `${color}.main`, mr: 1 }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={`${color}.main`}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Admin Navbar */}
      <AdminNavbar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Analytics Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7days">Last 7 days</MenuItem>
                <MenuItem value="30days">Last 30 days</MenuItem>
                <MenuItem value="90days">Last 90 days</MenuItem>
                <MenuItem value="1year">Last year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAnalyticsData}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {/* System Usage Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Response Time"
              value={analyticsData.systemUsage.avgResponseTime}
              icon={<Timeline />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="System Uptime"
              value={analyticsData.systemUsage.uptime}
              icon={<TrendingUp />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="API Calls"
              value={analyticsData.systemUsage.apiCalls.toLocaleString()}
              icon={<BarChart />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Error Rate"
              value={analyticsData.systemUsage.errorRate}
              icon={<Assessment />}
              color="warning"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* User Growth Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Growth ({timeRange})
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">
                    Chart visualization would go here
                    <br />
                    (Integration with chart library like Recharts needed)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Features Usage */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Features Usage
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {analyticsData.topFeatures.map((feature, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {feature.feature}
                        </Typography>
                        <Typography variant="body2">
                          {feature.usage}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          bgcolor: "grey.200",
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${feature.usage}%`,
                            height: 8,
                            bgcolor: "primary.main",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Diagnosis Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Diagnosis Statistics
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Diagnosis Type</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell align="right">Distribution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.diagnosisStats.map((stat, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {stat.type}
                          </TableCell>
                          <TableCell align="right">{stat.count}</TableCell>
                          <TableCell align="right">
                            {stat.percentage}%
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                width: 100,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ width: "100%", mr: 1 }}>
                                <Box
                                  sx={{
                                    height: 10,
                                    bgcolor: "grey.200",
                                    borderRadius: 1,
                                    position: "relative",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: `${stat.percentage}%`,
                                      height: "100%",
                                      bgcolor: "secondary.main",
                                      borderRadius: 1,
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminAnalytics;
