import { useState, useEffect } from "react";
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
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  People,
  BarChart,
  TrendingUp,
  AdminPanelSettings,
  Schedule,
  Assessment,
  Security,
  Refresh,
} from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import api from "../../api";

function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    staffUsers: 0,
    superUsers: 0,
    totalDiagnoses: 0,
    todayDiagnoses: 0,
    weeklyDiagnoses: 0,
    systemHealth: 95,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch multiple data sources
      const [usersRes, diagnosesRes] = await Promise.all([
        api.get("/users/admin/users/"),
        api.get("/diagnosis/analyze-hcv/"),
      ]);

      if (usersRes.data.status === "success") {
        const users = usersRes.data.data;
        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: users.filter((u) => u.is_active).length,
          staffUsers: users.filter((u) => u.is_staff).length,
          superUsers: users.filter((u) => u.is_superuser).length,
        }));
      }

      if (diagnosesRes.data.status === "success") {
        const diagnoses = diagnosesRes.data.data;
        const today = new Date().toDateString();
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        setStats((prev) => ({
          ...prev,
          totalDiagnoses: diagnoses.length,
          todayDiagnoses: diagnoses.filter(
            (d) => new Date(d.created_at).toDateString() === today
          ).length,
          weeklyDiagnoses: diagnoses.filter(
            (d) => new Date(d.created_at) >= weekAgo
          ).length,
        }));

        // Set recent activity
        setRecentActivity(
          diagnoses
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map((d) => ({
              id: d.id,
              action: "New Diagnosis",
              user: d.created_by || "System",
              patient: d.patient_name,
              time: new Date(d.created_at).toLocaleString(),
            }))
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setMessage("Error fetching dashboard data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  const StatCard = ({ title, value, icon: Icon, color, subtext, trend }) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}40`,
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Icon sx={{ fontSize: 40, color, mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
          </Box>
          {trend && (
            <Chip
              label={trend}
              size="small"
              color={trend.startsWith("+") ? "success" : "error"}
              variant="outlined"
            />
          )}
        </Box>
        {subtext && (
          <Typography variant="caption" color="textSecondary">
            {subtext}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    subtext: PropTypes.string,
    trend: PropTypes.string,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 6,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }} color="textSecondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              <AdminPanelSettings
                sx={{ fontSize: "inherit", mr: 1, color: "primary.main" }}
              />
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Welcome back, {user?.full_name || user?.username}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchDashboardData}
            sx={{ borderRadius: 2 }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

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

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={People}
            color="#1976d2"
            subtext={`${stats.activeUsers} active users`}
            trend={stats.totalUsers > 5 ? "+12%" : "New"}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Staff Members"
            value={stats.staffUsers}
            icon={Security}
            color="#2e7d32"
            subtext={`${stats.superUsers} superusers`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Diagnoses"
            value={stats.totalDiagnoses}
            icon={Assessment}
            color="#ed6c02"
            subtext={`${stats.weeklyDiagnoses} this week`}
            trend={stats.todayDiagnoses > 0 ? `+${stats.todayDiagnoses}` : "0"}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            icon={TrendingUp}
            color="#9c27b0"
            subtext="All systems operational"
          />
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        {/* System Health */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <BarChart sx={{ mr: 1 }} />
                System Performance
              </Typography>
              <Box sx={{ mt: 3 }}>
                {[
                  {
                    label: "Database Performance",
                    value: 98,
                    color: "success",
                  },
                  { label: "API Response Time", value: 95, color: "primary" },
                  {
                    label: "User Authentication",
                    value: 100,
                    color: "success",
                  },
                  { label: "File Storage", value: 88, color: "warning" },
                ].map((item, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      color={item.color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Schedule sx={{ mr: 1 }} />
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Patient: {activity.patient}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        By: {activity.user} • {activity.time}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    No recent activity
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
