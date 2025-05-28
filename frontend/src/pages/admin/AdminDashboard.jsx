import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  People,
  TrendingUp,
  AdminPanelSettings,
  Schedule,
  Security,
  Refresh,
  PersonAdd,
  SupervisorAccount,
  Badge,
  Email,
  CalendarToday,
  LoginRounded,
  BugReport,
  Speed,
  Storage,
  Memory,
} from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import api from "../../api";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [recentUsers, setRecentUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [systemInfo, setSystemInfo] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users data
      const usersResponse = await api.get("/users/admin/users/");

      if (usersResponse.data.status === "success") {
        const users = usersResponse.data.data;
        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: users.filter((u) => u.is_active).length,
          staffUsers: users.filter((u) => u.is_staff).length,
          superUsers: users.filter((u) => u.is_superuser).length,
        }));

        setRecentUsers(users.slice(-5)); // Last 5 users
        setAdminUsers(users.filter((u) => u.is_staff || u.is_superuser));

        // Simulate system info
        setSystemInfo({
          database_status: "Connected",
          auth_status: "Active",
          api_status: "Operational",
          memory_usage: "2.4 GB",
          disk_usage: "45%",
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setMessage("Error loading dashboard data. Using sample data.");
      setMessageType("warning");

      // Set fallback data
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        staffUsers: 0,
        superUsers: 0,
        totalDiagnoses: 0,
        todayDiagnoses: 0,
        weeklyDiagnoses: 0,
        systemHealth: 85,
      });
    } finally {
      setLoading(false);
    }
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
            <AdminPanelSettings
              sx={{ fontSize: "inherit", mr: 1, color: "primary.main" }}
            />
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back, {user?.full_name || user?.first_name || user?.email}
          </Typography>
        </Box>{" "}
        <Box sx={{ display: "flex", gap: 1 }}>
          {" "}
          <Button
            variant="outlined"
            startIcon={<BugReport />}
            onClick={() => navigate("/admin/debug")}
            color="secondary"
          >
            Debug Console
          </Button>
          <Button
            variant="outlined"
            startIcon={<Storage />}
            onClick={() => navigate("/admin/diagnosis-management")}
            color="primary"
          >
            Diagnosis Management
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchDashboardData}
            disabled={loading}
          >
            Refresh
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

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={People}
            color="primary"
            subtitle={`${stats.activeUsers} active`}
            trend={
              stats.totalUsers > 0
                ? `+${stats.totalUsers - stats.activeUsers}`
                : "0"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Staff Members"
            value={stats.staffUsers}
            icon={SupervisorAccount}
            color="warning"
            subtitle={`${stats.superUsers} superusers`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            icon={Speed}
            color="success"
            subtitle="All systems operational"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value={stats.activeUsers}
            icon={Security}
            color="info"
            subtitle="Current online users"
          />
        </Grid>

        {/* Admin Users Section */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: "100%" }}>
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
                  <Badge sx={{ mr: 1 }} />
                  Administrative Users ({adminUsers.length})
                </Typography>{" "}
                <Button
                  size="small"
                  startIcon={<PersonAdd />}
                  onClick={() => navigate("/admin/users")}
                  variant="outlined"
                >
                  Manage Users
                </Button>
              </Box>
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {adminUsers.length > 0 ? (
                  adminUsers.map((admin) => (
                    <AdminUserCard
                      key={admin.id}
                      admin={admin}
                      currentUser={user}
                    />
                  ))
                ) : (
                  <Typography color="textSecondary" textAlign="center" py={4}>
                    No administrative users found
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Storage sx={{ mr: 1 }} />
                System Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ bgcolor: "primary.100", color: "primary.600" }}
                    >
                      <Memory />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Database"
                    secondary={systemInfo.database_status || "Connected"}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ bgcolor: "success.100", color: "success.600" }}
                    >
                      <Security />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Authentication"
                    secondary={systemInfo.auth_status || "Active"}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "info.100", color: "info.600" }}>
                      <TrendingUp />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="API Status"
                    secondary={systemInfo.api_status || "Operational"}
                  />
                </ListItem>
              </List>

              {/* System Health Progress */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Overall System Health
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.systemHealth}
                  sx={{ height: 8, borderRadius: 4 }}
                  color={
                    stats.systemHealth > 80
                      ? "success"
                      : stats.systemHealth > 60
                      ? "warning"
                      : "error"
                  }
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {stats.systemHealth}% -{" "}
                  {stats.systemHealth > 80
                    ? "Excellent"
                    : stats.systemHealth > 60
                    ? "Good"
                    : "Needs Attention"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent User Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Schedule sx={{ mr: 1 }} />
                Recent User Activity
              </Typography>
              <List>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <ListItem
                      key={user.id}
                      divider={index < recentUsers.length - 1}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.profile_picture}>
                          {(user.full_name || user.email)
                            .charAt(0)
                            .toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          user.full_name ||
                          `${user.first_name} ${user.last_name}`.trim() ||
                          user.username
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Joined:{" "}
                              {new Date(user.date_joined).toLocaleDateString()}{" "}
                              • Last login:{" "}
                              {user.last_login
                                ? new Date(user.last_login).toLocaleDateString()
                                : "Never"}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        {user.is_superuser && (
                          <Chip label="Superuser" color="error" size="small" />
                        )}
                        {user.is_staff && !user.is_superuser && (
                          <Chip label="Staff" color="warning" size="small" />
                        )}
                        <Chip
                          label={user.is_active ? "Active" : "Inactive"}
                          color={user.is_active ? "success" : "default"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography color="textSecondary" textAlign="center" py={4}>
                    No recent user activity
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>{" "}
        </Grid>
      </Grid>
    </Box>
  );
}

// PropTypes for StatCard component
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

// PropTypes for AdminUserCard component
const AdminUserCard = ({ admin, currentUser }) => (
  <Card sx={{ mb: 2, border: "1px solid", borderColor: "grey.200" }}>
    <CardContent sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={admin.profile_picture} sx={{ width: 50, height: 50 }}>
          {(admin.full_name || admin.email).charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {admin.full_name ||
              `${admin.first_name} ${admin.last_name}`.trim() ||
              admin.username}
            {admin.id === currentUser?.id && (
              <Chip
                label="You"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: 1, fontSize: "0.7rem", height: 20 }}
              />
            )}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Email sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="textSecondary">
              {admin.email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            {admin.is_superuser && (
              <Chip
                label="Superuser"
                color="error"
                size="small"
                icon={<AdminPanelSettings />}
              />
            )}
            {admin.is_staff && !admin.is_superuser && (
              <Chip
                label="Staff"
                color="warning"
                size="small"
                icon={<SupervisorAccount />}
              />
            )}
            <Chip
              label={admin.is_active ? "Active" : "Inactive"}
              color={admin.is_active ? "success" : "default"}
              size="small"
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="textSecondary">
                Joined: {new Date(admin.date_joined).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LoginRounded sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="textSecondary">
                Last:{" "}
                {admin.last_login
                  ? new Date(admin.last_login).toLocaleDateString()
                  : "Never"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

AdminUserCard.propTypes = {
  admin: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    profile_picture: PropTypes.string,
    full_name: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string.isRequired,
    is_superuser: PropTypes.bool,
    is_staff: PropTypes.bool,
    is_active: PropTypes.bool,
    date_joined: PropTypes.string,
    last_login: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default AdminDashboard;
