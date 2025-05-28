import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Dashboard,
  People,
  Analytics,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  AdminPanelSettings,
  Security,
  Help,
  BugReport,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(3); // Mock notification count

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
    handleMenuClose();
  };

  const handleMainApp = () => {
    navigate("/");
  };

  const navigationItems = [
    { label: "Dashboard", path: "/admin", icon: Dashboard },
    { label: "Users", path: "/admin/users", icon: People },
    { label: "Analytics", path: "/admin/analytics", icon: Analytics },
    { label: "System", path: "/admin/system", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1a237e",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ minHeight: "64px" }}>
        {/* Logo and Admin Title */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
          <AdminPanelSettings sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "white",
              fontSize: "1.2rem",
            }}
          >
            HepatoCAI Admin
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                startIcon={<Icon />}
                onClick={() => navigate(item.path)}
                sx={{
                  color: "white",
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActive(item.path)
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Back to Main App */}
          <Tooltip title="Back to Main App">
            <Button
              variant="outlined"
              size="small"
              onClick={handleMainApp}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Main App
            </Button>
          </Tooltip>

          {/* User Profile */}
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1, p: 0 }}>
              <Avatar
                src={user?.profile_picture}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#3f51b5",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {!user?.profile_picture &&
                  (user?.first_name?.[0] || user?.email?.[0] || "A")}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 220,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* User Info */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" color="text.primary">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.is_superuser ? "Super Admin" : "Admin"}
            </Typography>
          </Box>
          <Divider />

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Security fontSize="small" />
            </ListItemIcon>
            <ListItemText>Security</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Help fontSize="small" />
            </ListItemIcon>
            <ListItemText>Help</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <BugReport fontSize="small" />
            </ListItemIcon>
            <ListItemText>Report Issue</ListItemText>
          </MenuItem>

          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNavbar;
