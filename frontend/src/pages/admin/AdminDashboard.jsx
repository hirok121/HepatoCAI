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
  Container,
  Fade,
  Slide,
  Grow,
  Tooltip,
  keyframes,
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
import { useAuth } from "../../hooks/AuthContext";
import api from "../../services/api";
import AdminNavBar from "../../components/admin/AdminNavbar";

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

  // Animation keyframes
  const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const pulse = keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  `;

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users data
      const usersResponse = await api.get("/users/admin/users/");

      if (usersResponse.data.status === "success") {
        const users = usersResponse.data.data;
        const statistics = usersResponse.data.statistics;

        // Use statistics from API response if available
        setStats((prev) => ({
          ...prev,
          totalUsers: statistics?.total_users,
          activeUsers: statistics?.active_users,
          staffUsers: statistics?.staff_users,
          superUsers: statistics?.super_users,
          totalDiagnoses: 0, // Will be updated when diagnosis endpoint is available
          todayDiagnoses: 0,
          weeklyDiagnoses: 0,
          systemHealth: 95,
        }));

        setRecentUsers(users.slice(-5)); // Last 5 users
        setAdminUsers(users.filter((u) => u.is_staff || u.is_superuser));

        // Set system info based on successful API response
        setSystemInfo({
          database_status: "Connected",
          auth_status: "Active",
          api_status: "Operational",
          memory_usage: "2.4 GB",
          disk_usage: "45%",
        });

        // Clear any previous error messages
        setMessage("");
        setMessageType("info");
      } else {
        throw new Error("Invalid response status");
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setMessage(
        "Error loading dashboard data. Please check your connection and try again."
      );
      setMessageType("error");

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

      setRecentUsers([]);
      setAdminUsers([]);

      setSystemInfo({
        database_status: "Error",
        auth_status: "Unknown",
        api_status: "Error",
        memory_usage: "N/A",
        disk_usage: "N/A",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: "white",
              mb: 3,
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          zIndex: 0,
        },
      }}
    >
      {/* Admin Navigation Bar */}
      <AdminNavBar />

      <Container
        maxWidth="xl"
        sx={{ pt: 4, pb: 6, position: "relative", zIndex: 1 }}
      >
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box
            sx={{
              mb: 4,
              p: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              animation: `${fadeInUp} 1s ease-out`,
            }}
          >
            {" "}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", lg: "center" },
                gap: { xs: 2, lg: 4 },
                minHeight: { xs: "auto", lg: "120px" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: { xs: "1 1 100%", lg: "1 1 65%" },
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, md: 2 },
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                    mb: { xs: 1, md: 2 },
                    lineHeight: 1.2,
                  }}
                >
                  <AdminPanelSettings
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
                      color: "#667eea",
                      flexShrink: 0,
                    }}
                  />
                  <Box component="span" sx={{ wordBreak: "break-word" }}>
                    Admin Dashboard
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                    mb: { xs: 0.5, md: 1 },
                    lineHeight: 1.3,
                  }}
                >
                  Welcome back,{" "}
                  {user?.full_name || user?.first_name || user?.email}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                    lineHeight: 1.4,
                    maxWidth: { xs: "100%", lg: "500px" },
                  }}
                >
                  Monitor and manage your application from this central hub
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "row" },
                  flexWrap: "wrap",
                  gap: { xs: 1, sm: 2 },
                  justifyContent: { xs: "flex-start", lg: "flex-end" },
                  alignItems: "center",
                  flex: { xs: "1 1 100%", lg: "0 0 auto" },
                  minWidth: { xs: "100%", lg: "auto" },
                  mt: { xs: 2, lg: 0 },
                }}
              >
                {" "}
                <Tooltip title="View system diagnostics">
                  <Button
                    variant="outlined"
                    startIcon={<BugReport />}
                    onClick={() => navigate("/admin/debug")}
                    size="small"
                    sx={{
                      borderColor: "#667eea",
                      color: "#667eea",
                      whiteSpace: "nowrap",
                      minWidth: "auto",
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      "&:hover": {
                        borderColor: "#764ba2",
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: "none", sm: "inline" },
                      }}
                    >
                      Debug Console
                    </Box>
                    <Box
                      sx={{
                        display: { xs: "inline", sm: "none" },
                      }}
                    >
                      Debug
                    </Box>
                  </Button>
                </Tooltip>
                <Tooltip title="Manage diagnosis records">
                  <Button
                    variant="outlined"
                    startIcon={<Storage />}
                    onClick={() => navigate("/admin/diagnosis-management")}
                    size="small"
                    sx={{
                      borderColor: "#667eea",
                      color: "#667eea",
                      whiteSpace: "nowrap",
                      minWidth: "auto",
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      "&:hover": {
                        borderColor: "#764ba2",
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: "none", sm: "inline" },
                      }}
                    >
                      Diagnosis Management
                    </Box>
                    <Box
                      sx={{
                        display: { xs: "inline", sm: "none" },
                      }}
                    >
                      Diagnosis
                    </Box>
                  </Button>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchDashboardData}
                  disabled={loading}
                  size="small"
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: 600,
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", sm: "inline" },
                    }}
                  >
                    Refresh Data
                  </Box>
                  <Box
                    sx={{
                      display: { xs: "inline", sm: "none" },
                    }}
                  >
                    Refresh
                  </Box>
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Messages */}
        {message && (
          <Slide direction="down" in={!!message} timeout={500}>
            <Alert
              severity={messageType}
              sx={{
                mb: 4,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          </Slide>
        )}

        <Grid container spacing={4}>
          {/* Statistics Cards */}
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: People,
              color: "#667eea",
              subtitle: `${stats.activeUsers} active`,
              trend:
                stats.totalUsers > 0
                  ? `+${stats.totalUsers - stats.activeUsers}`
                  : "0",
              delay: 200,
            },
            {
              title: "Staff Members",
              value: stats.staffUsers,
              icon: SupervisorAccount,
              color: "#f093fb",
              subtitle: `${stats.superUsers} superusers`,
              delay: 400,
            },
            {
              title: "System Health",
              value: `${stats.systemHealth}%`,
              icon: Speed,
              color: "#4facfe",
              subtitle: "All systems operational",
              delay: 600,
            },
            {
              title: "Active Sessions",
              value: stats.activeUsers,
              icon: Security,
              color: "#43e97b",
              subtitle: "Current online users",
              delay: 800,
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Grow
                in
                timeout={1000}
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div>
                  <StatCard {...stat} />
                </div>
              </Grow>
            </Grid>
          ))}{" "}
          {/* Admin Users Section */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={1200}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: { xs: 2, sm: 0 },
                      mb: 3,
                      pb: 2,
                      borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#2d3748",
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      }}
                    >
                      <Badge sx={{ color: "#667eea" }} />
                      Administrative Users ({adminUsers.length})
                    </Typography>
                    <Button
                      startIcon={<PersonAdd />}
                      onClick={() => navigate("/admin/users")}
                      variant="contained"
                      size="small"
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        flexShrink: 0,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Manage Users
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 0,
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        overflow: "auto",
                        maxHeight: 450,
                        pr: 1,
                      }}
                    >
                      {adminUsers.length > 0 ? (
                        adminUsers.map((admin, index) => (
                          <Slide
                            key={admin.id}
                            direction="up"
                            in
                            timeout={800}
                            style={{ transitionDelay: `${index * 100}ms` }}
                          >
                            <div>
                              <AdminUserCard admin={admin} currentUser={user} />
                            </div>
                          </Slide>
                        ))
                      ) : (
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 200,
                          }}
                        >
                          <Typography color="text.secondary" textAlign="center">
                            No administrative users found
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>{" "}
          {/* System Information */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1400}>
              <Card
                sx={{
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#2d3748",
                      mb: 3,
                    }}
                  >
                    <Storage sx={{ color: "#667eea" }} />
                    System Information
                  </Typography>

                  <List dense sx={{ mb: 3 }}>
                    {[
                      {
                        icon: Memory,
                        label: "Database",
                        value: systemInfo.database_status || "Connected",
                        color: "#667eea",
                      },
                      {
                        icon: Security,
                        label: "Authentication",
                        value: systemInfo.auth_status || "Active",
                        color: "#4facfe",
                      },
                      {
                        icon: TrendingUp,
                        label: "API Status",
                        value: systemInfo.api_status || "Operational",
                        color: "#43e97b",
                      },
                    ].map((item, index) => (
                      <Slide
                        key={index}
                        direction="left"
                        in
                        timeout={800}
                        style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                      >
                        <ListItem sx={{ px: 0, py: 2 }}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: `${item.color}20`,
                                color: item.color,
                                width: 48,
                                height: 48,
                              }}
                            >
                              <item.icon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600}>
                                {item.label}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.value}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Slide>
                    ))}
                  </List>

                  {/* System Health Progress */}
                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      gutterBottom
                      fontWeight={600}
                    >
                      Overall System Health
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={stats.systemHealth}
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(102, 126, 234, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            background:
                              stats.systemHealth > 80
                                ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                                : stats.systemHealth > 60
                                ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {stats.systemHealth}%
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {stats.systemHealth > 80
                        ? "🟢 Excellent Performance"
                        : stats.systemHealth > 60
                        ? "🟡 Good Performance"
                        : "🔴 Needs Attention"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
          {/* Recent User Activity */}
          <Grid item xs={12}>
            <Fade in timeout={1600}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#2d3748",
                      mb: 3,
                      pb: 2,
                      borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <Schedule sx={{ color: "#667eea" }} />
                    Recent User Activity
                  </Typography>

                  <List>
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user, index) => (
                        <Slide
                          key={user.id}
                          direction="up"
                          in
                          timeout={800}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <ListItem
                            divider={index < recentUsers.length - 1}
                            sx={{
                              py: 2,
                              "&:hover": {
                                backgroundColor: "rgba(102, 126, 234, 0.05)",
                                borderRadius: 2,
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={user.profile_picture}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                }}
                              >
                                {(user.full_name || user.email)
                                  .charAt(0)
                                  .toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="h6" fontWeight={600}>
                                  {user.full_name ||
                                    `${user.first_name} ${user.last_name}`.trim() ||
                                    user.username}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {user.email}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mt: 0.5 }}
                                  >
                                    Joined:{" "}
                                    {new Date(
                                      user.date_joined
                                    ).toLocaleDateString()}{" "}
                                    • Last login:{" "}
                                    {user.last_login
                                      ? new Date(
                                          user.last_login
                                        ).toLocaleDateString()
                                      : "Never"}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                alignItems: "flex-end",
                              }}
                            >
                              {user.is_superuser && (
                                <Chip
                                  label="Superuser"
                                  size="small"
                                  sx={{
                                    background:
                                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                              {user.is_staff && !user.is_superuser && (
                                <Chip
                                  label="Staff"
                                  size="small"
                                  sx={{
                                    background:
                                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                              <Chip
                                label={user.is_active ? "Active" : "Inactive"}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: user.is_active
                                    ? "#43e97b"
                                    : "#gray",
                                  color: user.is_active ? "#43e97b" : "#gray",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          </ListItem>
                        </Slide>
                      ))
                    ) : (
                      <Typography
                        color="text.secondary"
                        textAlign="center"
                        py={8}
                      >
                        No recent user activity
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// PropTypes for StatCard component
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <Card
    sx={{
      height: "100%",
      minHeight: "180px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "visible",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-4px) scale(1.01)",
        boxShadow: "0 16px 32px rgba(0, 0, 0, 0.15)",
        "& .stat-icon": {
          transform: "scale(1.1) rotate(5deg)",
        },
        "& .stat-value": {
          transform: "scale(1.02)",
        },
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${color}, ${color}90)`,
        borderRadius: "3px 3px 0 0",
      },
    }}
  >
    <CardContent
      sx={{
        p: { xs: 2, sm: 3 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header with Icon and Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
          mb: 2,
        }}
      >
        <Avatar
          className="stat-icon"
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            transition: "all 0.3s ease",
            boxShadow: `0 4px 12px ${color}20`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: { xs: 24, sm: 28 } }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              mb: 0.5,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>

        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{
              background: trend.startsWith("+")
                ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              height: { xs: 20, sm: 24 },
            }}
          />
        )}
      </Box>

      {/* Value */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          component="div"
          className="stat-value"
          sx={{
            fontWeight: 800,
            color: "#2d3748",
            transition: "all 0.3s ease",
            lineHeight: 1,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
          }}
        >
          {value}
        </Typography>
      </Box>

      {/* Subtitle */}
      {subtitle && (
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            backgroundColor: `${color}08`,
            borderRadius: 2,
            border: `1px solid ${color}20`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              textAlign: "center",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      )}
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
  <Card
    sx={{
      mb: 2,
      border: "1px solid rgba(102, 126, 234, 0.1)",
      borderRadius: 2,
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.15)",
        borderColor: "rgba(102, 126, 234, 0.3)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          gap: 3,
        }}
      >
        {/* Avatar Section */}
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={admin.profile_picture}
            sx={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "3px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
          >
            {(admin.full_name || admin.email).charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {/* Name and You badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#2d3748",
                fontSize: "1.1rem",
              }}
            >
              {admin.full_name ||
                `${admin.first_name} ${admin.last_name}`.trim() ||
                admin.username}
            </Typography>
            {admin.id === currentUser?.id && (
              <Chip
                label="You"
                size="small"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "0.7rem",
                  height: 20,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {/* Email */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 1,
            }}
          >
            <Email sx={{ fontSize: 16, color: "#667eea" }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                wordBreak: "break-word",
              }}
            >
              {admin.email}
            </Typography>
          </Box>

          {/* Role badges */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {admin.is_superuser && (
              <Chip
                label="Superuser"
                size="small"
                icon={<AdminPanelSettings sx={{ fontSize: 16 }} />}
                sx={{
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  color: "white",
                  fontWeight: 600,
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            )}
            {admin.is_staff && !admin.is_superuser && (
              <Chip
                label="Staff"
                size="small"
                icon={<SupervisorAccount sx={{ fontSize: 16 }} />}
                sx={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  fontWeight: 600,
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            )}
            <Chip
              label={admin.is_active ? "Active" : "Inactive"}
              size="small"
              variant="outlined"
              sx={{
                borderColor: admin.is_active ? "#10b981" : "#94a3b8",
                color: admin.is_active ? "#10b981" : "#94a3b8",
                fontWeight: 600,
                backgroundColor: admin.is_active
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(148, 163, 184, 0.1)",
              }}
            />
          </Box>

          {/* Date information */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              gap: { xs: 1, sm: 3 },
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <CalendarToday sx={{ fontSize: 14, color: "#94a3b8" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Joined: {new Date(admin.date_joined).toLocaleDateString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <LoginRounded sx={{ fontSize: 14, color: "#94a3b8" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
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
