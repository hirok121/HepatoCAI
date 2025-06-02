import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Container,
  Fade,
  Slide,
  Grow,
  keyframes,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Search,
  MoreVert,
  PersonAdd,
  Refresh,
  Download,
  People,
  AdminPanelSettings,
  Block,
  CheckCircle,
  TrendingUp,
  Group,
  SupervisorAccount,
  Phone,
  LocationOn,
  KeyboardArrowUp,
  KeyboardArrowDown,
  LoginRounded,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/AuthContext";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

// Animated Statistics Card Component - moved outside to prevent re-rendering
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
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

  return (
    <Grow in={true} timeout={1000}>
      <Card
        sx={{
          height: "100%",
          minHeight: "160px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: `${fadeInUp} 0.6s ease-out`,
          "&:hover": {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 16px 32px rgba(0, 0, 0, 0.15)",
            "& .stat-icon": {
              transform: "scale(1.1) rotate(5deg)",
            },
            "& .stat-value": {
              animation: `${pulse} 0.6s ease-in-out`,
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
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Avatar
              className="stat-icon"
              sx={{
                bgcolor: `${color}15`,
                color: color,
                width: 56,
                height: 56,
                transition: "all 0.3s ease",
                boxShadow: `0 4px 12px ${color}20`,
              }}
            >
              <Icon sx={{ fontSize: 28 }} />
            </Avatar>
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
                }}
              />
            )}
          </Box>

          <Typography
            variant="h3"
            component="div"
            className="stat-value"
            sx={{
              fontWeight: 800,
              color: "#2d3748",
              mb: 1,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: subtitle ? 2 : 0,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Box
              sx={{
                p: 1.5,
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
                  fontSize: "0.875rem",
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.string,
};

function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    user: null,
  });

  // Memoize stats calculation to prevent unnecessary re-renders - only recalculate when users change
  const calculatedStats = useMemo(() => {
    if (users.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        staffUsers: 0,
        superUsers: 0,
        newUsersThisWeek: 0,
        recentLogins: 0,
      };
    }

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.is_active).length;
    const staffUsers = users.filter(
      (u) => u.is_staff && !u.is_superuser
    ).length;
    const superUsers = users.filter((u) => u.is_superuser).length;

    // Calculate users joined this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersThisWeek = users.filter(
      (u) => new Date(u.date_joined) > oneWeekAgo
    ).length;

    // Calculate recent logins (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentLogins = users.filter(
      (u) => u.last_login && new Date(u.last_login) > oneDayAgo
    ).length;

    return {
      totalUsers,
      activeUsers,
      staffUsers,
      superUsers,
      newUsersThisWeek,
      recentLogins,
    };
  }, [users]);

  // Paginated users for table display
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = "/users/admin/users/";
      const response = await api.get(endpoint);

      if (response.data.status === "success") {
        const userData = response.data.data;
        setUsers(userData);
        setPermissions(response.data.permissions || {});
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching user data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole =
        filterRole === "all" ||
        (filterRole === "superuser" && user.is_superuser) ||
        (filterRole === "staff" && user.is_staff && !user.is_superuser) ||
        (filterRole === "user" && !user.is_staff);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && user.is_active) ||
        (filterStatus === "inactive" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
    setFilteredUsers(filtered);
    setPage(1);
  }, [users, searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleUserPermissionChange = async (userId, action) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    let confirmTitle = "";
    let confirmMessage = "";

    switch (action) {
      case "promote_to_staff":
        confirmTitle = "Promote to Staff";
        confirmMessage = `Are you sure you want to promote ${
          targetUser.full_name || targetUser.email
        } to staff status?`;
        break;
      case "promote_to_superuser":
        confirmTitle = "Promote to Superuser";
        confirmMessage = `Are you sure you want to promote ${
          targetUser.full_name || targetUser.email
        } to superuser status? This will also grant staff privileges.`;
        break;
      case "demote_from_superuser":
        confirmTitle = "Demote from Superuser";
        confirmMessage = `Are you sure you want to demote ${
          targetUser.full_name || targetUser.email
        } from superuser status? Staff privileges will be retained.`;
        break;
      case "demote_from_staff":
        confirmTitle = "Demote from Staff";
        confirmMessage = `Are you sure you want to demote ${
          targetUser.full_name || targetUser.email
        } from staff status?`;
        break;
      case "activate":
        confirmTitle = "Activate User";
        confirmMessage = `Are you sure you want to activate ${
          targetUser.full_name || targetUser.email
        }?`;
        break;
      case "deactivate":
        confirmTitle = "Deactivate User";
        confirmMessage = `Are you sure you want to deactivate ${
          targetUser.full_name || targetUser.email
        }?`;
        break;
      default:
        return;
    }

    setConfirmDialog({
      open: true,
      title: confirmTitle,
      message: confirmMessage,
      action: () => confirmUserPermissionChange(userId, action),
    });
  };

  const confirmUserPermissionChange = async (userId, action) => {
    try {
      const endpoint = `/users/admin/users/${userId}/`;
      const response = await api.patch(endpoint, { action });

      if (response.data.status === "success") {
        setMessage(`User permissions updated successfully`);
        setMessageType("success");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user permissions:", error);
      const errorMsg =
        error.response?.data?.error || "Error updating user permissions";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setConfirmDialog({ open: false, title: "", message: "", action: null });
      setActionMenuAnchor(null);
    }
  };

  const handleActionMenuOpen = (event, user) => {
    setSelectedUser(user);
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleViewDetails = (user) => {
    setDetailDialog({ open: true, user });
    handleActionMenuClose();
  };
  const exportUsers = async () => {
    try {
      const response = await api.get("/users/admin/users/?export=csv", {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users_export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("Users exported successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error exporting users:", error);
      setMessage("Error exporting users");
      setMessageType("error");
    }
  };

  const getUserRoleChip = (user) => {
    if (user.is_superuser) {
      return (
        <Chip
          label="Superuser"
          size="small"
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
          }}
          icon={<AdminPanelSettings sx={{ fontSize: 16, color: "white" }} />}
        />
      );
    }
    if (user.is_staff) {
      return (
        <Chip
          label="Staff"
          size="small"
          sx={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(240, 147, 251, 0.3)",
          }}
          icon={<SupervisorAccount sx={{ fontSize: 16, color: "white" }} />}
        />
      );
    }
    return (
      <Chip
        label="User"
        size="small"
        variant="outlined"
        sx={{
          borderColor: "#94a3b8",
          color: "#64748b",
          fontWeight: 600,
          backgroundColor: "rgba(148, 163, 184, 0.1)",
        }}
        icon={<People sx={{ fontSize: 16 }} />}
      />
    );
  };

  const getStatusChip = (user) => {
    return (
      <Chip
        label={user.is_active ? "Active" : "Inactive"}
        size="small"
        sx={{
          background: user.is_active
            ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
          color: "white",
          fontWeight: 600,
          boxShadow: user.is_active
            ? "0 2px 8px rgba(16, 185, 129, 0.3)"
            : "0 2px 8px rgba(239, 68, 68, 0.3)",
        }}
        icon={
          user.is_active ? (
            <CheckCircle sx={{ fontSize: 16, color: "white" }} />
          ) : (
            <Block sx={{ fontSize: 16, color: "white" }} />
          )
        }
      />
    );
  };

  const getActionMenuItems = (user) => {
    const items = [];

    // View Details
    items.push(
      <MenuItem key="view" onClick={() => handleViewDetails(user)}>
        <People sx={{ mr: 1, fontSize: 18 }} />
        View Details
      </MenuItem>
    );

    // Activation/Deactivation
    if (permissions.can_deactivate_users) {
      items.push(
        <MenuItem
          key="activation"
          onClick={() => {
            handleUserPermissionChange(
              user.id,
              user.is_active ? "deactivate" : "activate"
            );
          }}
        >
          {user.is_active ? (
            <Block sx={{ mr: 1, fontSize: 18 }} />
          ) : (
            <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
          )}
          {user.is_active ? "Deactivate" : "Activate"}
        </MenuItem>
      );
    }

    items.push(<Divider key="divider1" />);

    // Role Management - Hierarchical
    if (
      permissions.can_promote_to_staff ||
      permissions.can_promote_to_superuser
    ) {
      if (user.is_superuser) {
        // Superuser can be demoted to staff
        items.push(
          <MenuItem
            key="demote-superuser"
            onClick={() => {
              handleUserPermissionChange(user.id, "demote_from_superuser");
            }}
            disabled={!permissions.can_promote_to_superuser}
          >
            <KeyboardArrowDown sx={{ mr: 1, fontSize: 18 }} />
            Demote from Superuser
          </MenuItem>
        );
      } else if (user.is_staff) {
        // Staff can be promoted to superuser or demoted to regular user
        items.push(
          <MenuItem
            key="promote-superuser"
            onClick={() => {
              handleUserPermissionChange(user.id, "promote_to_superuser");
            }}
            disabled={!permissions.can_promote_to_superuser}
          >
            <KeyboardArrowUp sx={{ mr: 1, fontSize: 18 }} />
            Promote to Superuser
          </MenuItem>
        );
        items.push(
          <MenuItem
            key="demote-staff"
            onClick={() => {
              handleUserPermissionChange(user.id, "demote_from_staff");
            }}
            disabled={!permissions.can_promote_to_staff}
          >
            <KeyboardArrowDown sx={{ mr: 1, fontSize: 18 }} />
            Demote from Staff
          </MenuItem>
        );
      } else {
        // Regular user can be promoted to staff
        items.push(
          <MenuItem
            key="promote-staff"
            onClick={() => {
              handleUserPermissionChange(user.id, "promote_to_staff");
            }}
            disabled={!permissions.can_promote_to_staff}
          >
            <KeyboardArrowUp sx={{ mr: 1, fontSize: 18 }} />
            Promote to Staff
          </MenuItem>
        );
      }
    }
    return items;
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AdminNavbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <AdminNavbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <People sx={{ fontSize: "inherit", color: "primary.main" }} />
              User Management
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Manage system users, roles, and permissions with advanced controls
            </Typography>
          </Box>
        </Fade>{" "}
        {/* Statistics Dashboard */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Users"
                value={calculatedStats.totalUsers}
                icon={Group}
                color="#667eea"
                subtitle="All registered users"
                trend={
                  calculatedStats.newUsersThisWeek > 0
                    ? `+${calculatedStats.newUsersThisWeek} this week`
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Active Users"
                value={calculatedStats.activeUsers}
                icon={CheckCircle}
                color="#10b981"
                subtitle="Currently active accounts"
                trend={`${
                  Math.round(
                    (calculatedStats.activeUsers / calculatedStats.totalUsers) *
                      100
                  ) || 0
                }% active`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Staff Members"
                value={calculatedStats.staffUsers}
                icon={SupervisorAccount}
                color="#f093fb"
                subtitle="Staff level access"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Administrators"
                value={calculatedStats.superUsers}
                icon={AdminPanelSettings}
                color="#ff6b6b"
                subtitle="Superuser privileges"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="New Users"
                value={calculatedStats.newUsersThisWeek}
                icon={TrendingUp}
                color="#f59e0b"
                subtitle="Joined this week"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Recent Logins"
                value={calculatedStats.recentLogins}
                icon={LoginRounded}
                color="#8b5cf6"
                subtitle="Last 24 hours"
              />
            </Grid>
          </Grid>
        </Box>
        {/* Messages */}
        {message && (
          <Slide direction="down" in={Boolean(message)} timeout={500}>
            <Alert
              severity={messageType}
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          </Slide>
        )}
        {/* Controls */}
        <Fade in={true} timeout={1200}>
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search users by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Role Filter</InputLabel>
                    <Select
                      value={filterRole}
                      label="Role Filter"
                      onChange={(e) => setFilterRole(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Roles</MenuItem>
                      <MenuItem value="superuser">Superuser</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Status Filter"
                      onChange={(e) => setFilterStatus(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={fetchUsers}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={exportUsers}
                      sx={{ borderRadius: 2 }}
                    >
                      Export
                    </Button>
                    {permissions.can_promote_to_staff && (
                      <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => {
                          /* Add user functionality */
                        }}
                        sx={{
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        Add User
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
        {/* Users Table */}
        <Fade in={true} timeout={1400}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}
          >
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "grey.50" }}>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            User
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Email
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Contact
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Location
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Role
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Status
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Joined
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Last Login
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {" "}
                        {paginatedUsers.map((user, index) => (
                          <Fade
                            key={user.id}
                            in={true}
                            timeout={200 + index * 100}
                          >
                            <TableRow
                              hover
                              onClick={() => handleViewDetails(user)}
                              sx={{
                                bgcolor:
                                  user.id === currentUser?.id
                                    ? "primary.50"
                                    : "inherit",
                                borderLeft:
                                  user.id === currentUser?.id
                                    ? "4px solid"
                                    : "none",
                                borderLeftColor: "primary.main",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "rgba(102, 126, 234, 0.04)",
                                  transform: "translateX(2px)",
                                },
                              }}
                            >
                              <TableCell sx={{ py: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar
                                    src={user.profile_picture}
                                    sx={{
                                      width: 44,
                                      height: 44,
                                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                    }}
                                  >
                                    {(
                                      user.full_name ||
                                      user.username ||
                                      user.email
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      {user.full_name ||
                                        `${user.first_name} ${user.last_name}`.trim() ||
                                        user.username}
                                      {user.id === currentUser?.id && (
                                        <Chip
                                          label="You"
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                          sx={{
                                            ml: 1,
                                            fontSize: "0.7rem",
                                            height: 20,
                                          }}
                                        />
                                      )}
                                    </Typography>
                                    {user.is_social_user && (
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        {user.social_provider} Login
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body2">
                                  {user.email}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Box>
                                  {user.phone_number && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <Phone sx={{ fontSize: 14 }} />
                                      {user.phone_number}
                                      {user.phone_verified_at && (
                                        <Chip
                                          label="✓"
                                          size="small"
                                          color="success"
                                          sx={{
                                            ml: 0.5,
                                            height: 16,
                                            fontSize: "0.6rem",
                                          }}
                                        />
                                      )}
                                    </Typography>
                                  )}
                                  {user.login_count !== undefined && (
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {user.login_count} logins
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Box>
                                  {(user.city || user.country) && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <LocationOn sx={{ fontSize: 14 }} />
                                      {[user.city, user.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </Typography>
                                  )}
                                  {user.timezone && (
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      🕒 {user.timezone}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                {getUserRoleChip(user)}
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                {getStatusChip(user)}
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body2">
                                  {new Date(
                                    user.date_joined
                                  ).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body2">
                                  {user.last_login
                                    ? new Date(
                                        user.last_login
                                      ).toLocaleDateString()
                                    : "Never"}
                                </Typography>
                              </TableCell>{" "}
                              <TableCell sx={{ py: 2 }}>
                                <Tooltip title="User Actions">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row click
                                      handleActionMenuOpen(e, user);
                                    }}
                                    disabled={user.id === currentUser?.id}
                                    sx={{
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        backgroundColor: "primary.100",
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <MoreVert />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </Fade>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  {filteredUsers.length > rowsPerPage && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 3 }}
                    >
                      <Pagination
                        count={Math.ceil(filteredUsers.length / rowsPerPage)}
                        page={page}
                        onChange={(e, newPage) => setPage(newPage)}
                        color="primary"
                        size="large"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* No users found */}
                  {filteredUsers.length === 0 && !loading && (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <People sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        gutterBottom
                      >
                        No users found
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {searchTerm
                          ? "Try adjusting your search filters"
                          : "No users in the system"}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Fade>
        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              minWidth: 200,
            },
          }}
        >
          {selectedUser && getActionMenuItems(selectedUser)}
        </Menu>
        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() =>
            setConfirmDialog({
              open: false,
              title: "",
              message: "",
              action: null,
            })
          }
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() =>
                setConfirmDialog({
                  open: false,
                  title: "",
                  message: "",
                  action: null,
                })
              }
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDialog.action}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/* User Details Dialog */}
        <Dialog
          open={detailDialog.open}
          onClose={() => setDetailDialog({ open: false, user: null })}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={detailDialog.user?.profile_picture}
                sx={{
                  width: 64,
                  height: 64,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                {(
                  detailDialog.user?.full_name ||
                  detailDialog.user?.username ||
                  detailDialog.user?.email
                )
                  ?.charAt(0)
                  ?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {detailDialog.user?.full_name ||
                    `${detailDialog.user?.first_name} ${detailDialog.user?.last_name}`.trim() ||
                    detailDialog.user?.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {detailDialog.user?.email}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {detailDialog.user && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        First Name
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.first_name || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.last_name || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Username
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.username || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Account Type
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        {getUserRoleChip(detailDialog.user)}
                        {getStatusChip(detailDialog.user)}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Phone Number
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body1">
                          {detailDialog.user.phone_number || "Not provided"}
                        </Typography>
                        {detailDialog.user.phone_verified_at && (
                          <Chip
                            label="Verified"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Location Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Location Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">
                        Country
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.country || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">
                        City
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.city || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">
                        Timezone
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.timezone || "Not provided"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Activity Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Activity Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Date Joined
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          detailDialog.user.date_joined
                        ).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Last Login
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.last_login
                          ? new Date(
                              detailDialog.user.last_login
                            ).toLocaleString()
                          : "Never"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Login Count
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.login_count !== undefined
                          ? `${detailDialog.user.login_count} logins`
                          : "Not tracked"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Last Login IP
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {detailDialog.user.last_login_ip || "Not available"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Social Provider
                      </Typography>
                      <Typography variant="body1">
                        {detailDialog.user.is_social_user
                          ? detailDialog.user.social_provider ||
                            "Social Account"
                          : "Local Account"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Terms Accepted
                      </Typography>
                      <Box>
                        <Typography variant="body1">
                          {detailDialog.user.terms_accepted_at
                            ? new Date(
                                detailDialog.user.terms_accepted_at
                              ).toLocaleDateString()
                            : "Not accepted"}
                        </Typography>
                        {detailDialog.user.terms_version && (
                          <Typography variant="caption" color="textSecondary">
                            Version: {detailDialog.user.terms_version}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setDetailDialog({ open: false, user: null })}
              variant="contained"
              sx={{
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default UserManagement;
