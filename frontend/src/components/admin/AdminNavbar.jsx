import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Button,
  Container,
  Chip,
  LinearProgress,
  Divider,
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
  MedicalServices,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "@mui/material/styles";
import { HepatoCAIIcon } from "../ui/CustomIcons";

function AdminNavbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [notificationCount] = useState(3); // Mock notification count

  const handleLeftDrawerToggle = () => setLeftDrawerOpen(!leftDrawerOpen);
  const handleProfileDrawerToggle = () =>
    setProfileDrawerOpen(!profileDrawerOpen);

  const handleLogout = () => {
    logout();
    setProfileDrawerOpen(false);
    navigate("/signin");
  };

  const handleMainApp = () => {
    navigate("/");
  };
  const navigationItems = [
    { label: "Dashboard", path: "/admin", icon: Dashboard },
    { label: "Users", path: "/admin/users", icon: People },
    {
      label: "Diagnosis Management",
      path: "/admin/diagnosis-management",
      icon: MedicalServices,
    },
    { label: "Debug Console", path: "/admin/debug", icon: BugReport },
    { label: "Analytics", path: "/admin/analytics", icon: Analytics },
    { label: "System", path: "/admin/system", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  // Profile menu items for right drawer
  const profileMenuItems = [
    {
      label: "Profile",
      icon: <AccountCircle />,
      action: () => navigate("/profile"),
    },
    {
      label: "Security",
      icon: <Security />,
      action: () => {},
    },
    {
      label: "Help",
      icon: <Help />,
      action: () => {},
    },
    {
      label: "Report Issue",
      icon: <BugReport />,
      action: () => {},
    },
    { label: "Logout", icon: <Logout />, action: handleLogout },
  ];

  // Left drawer content for admin navigation
  const leftDrawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "#000000",
          }}
        >
          Admin Menu
        </Typography>
        <IconButton
          onClick={handleLeftDrawerToggle}
          size="small"
          sx={{
            color: "#000000",
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.08)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ py: 1 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem
              key={item.path}
              disablePadding
              onClick={() => {
                navigate(item.path);
                handleLeftDrawerToggle();
              }}
            >
              <ListItemButton
                sx={{
                  py: 1.2,
                  px: 3,
                  backgroundColor: isActive(item.path)
                    ? "rgba(37, 99, 235, 0.12)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? "#2563EB" : "#000000",
                    minWidth: "40px",
                    "& .MuiSvgIcon-root": {
                      fontSize: "1.2rem",
                    },
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: isActive(item.path) ? "#2563EB" : "#000000",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // Right drawer content for profile menu
  const profileDrawerContent = (
    <Box sx={{ width: 280 }} role="presentation">
      {/* Profile Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <IconButton
          onClick={handleProfileDrawerToggle}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#000000",
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.08)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Avatar
          sx={{
            width: 72,
            height: 72,
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            fontWeight: 700,
            fontSize: "1.8rem",
          }}
          src={user?.profile_picture}
        >
          {!user?.profile_picture &&
            (user?.first_name?.[0] || user?.email?.[0] || "A")}
        </Avatar>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            fontSize: "1rem",
            color: "#000000",
            textAlign: "center",
          }}
        >
          {user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : user?.email || "Admin User"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666666",
            fontWeight: 500,
            fontSize: "0.85rem",
            textAlign: "center",
          }}
        >
          {user?.email || "admin@example.com"}
        </Typography>
        {user?.is_superuser ? (
          <Chip
            label="Super Admin"
            size="small"
            sx={{
              mt: 1,
              backgroundColor: "#DC2626",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
        ) : (
          <Chip
            label="Staff"
            size="small"
            sx={{
              mt: 1,
              backgroundColor: "#2563EB",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
        )}
      </Box>

      {/* Profile Menu Items */}
      <List sx={{ py: 1 }}>
        {profileMenuItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            onClick={() => {
              item.action();
              handleProfileDrawerToggle();
            }}
          >
            <ListItemButton
              sx={{
                py: 1.5,
                px: 3,
                "&:hover": {
                  backgroundColor:
                    item.label === "Logout"
                      ? "rgba(239, 68, 68, 0.08)"
                      : "rgba(37, 99, 235, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.label === "Logout" ? "#EF4444" : "#000000",
                  minWidth: "44px",
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.4rem",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: item.label === "Logout" ? "#EF4444" : "#000000",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(135deg, 
            ${theme.palette.background.paper} 0%, 
            rgba(255, 255, 255, 0.95) 50%, 
            ${theme.palette.background.paper} 100%)`,
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
            {/* Left Menu Icon */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open navigation drawer"
              sx={{
                mr: 1,
                color: "#000000",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={handleLeftDrawerToggle}
            >
              <MenuIcon sx={{ fontSize: "1.8rem" }} />
            </IconButton>

            {/* Enhanced Logo and Brand Name */}
            <Button
              onClick={() => navigate("/")}
              sx={{
                color: "#000000",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                padding: { xs: "8px 12px", sm: "8px 16px" },
                minWidth: "auto",
                borderRadius: "16px",
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  transform: "scale(1.02)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <HepatoCAIIcon />
            </Button>
            <Chip
              label="Admin"
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontSize: "0.7rem",
                backgroundColor: "#2563EB",
                color: "white",
                fontWeight: 700,
              }}
            />
            {/* Navigation Items - Desktop Only */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                flexGrow: 1,
                ml: 2,
              }}
            >
              {navigationItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <Box key={item.path} sx={{ position: "relative" }}>
                    <Button
                      startIcon={<Icon />}
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: "#000000",
                        textTransform: "none",
                        px: 2,
                        py: 1,
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        backgroundColor: isActive(item.path)
                          ? "rgba(37, 99, 235, 0.12)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(37, 99, 235, 0.08)",
                          transform: "translateY(-2px)",
                          "& .nav-underline": {
                            width: "100%",
                          },
                        },
                        transition: "all 0.3s ease",
                        position: "relative",
                      }}
                    >
                      {item.label}
                      <Box
                        className="nav-underline"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: isActive(item.path) ? "100%" : 0,
                          height: 2,
                          backgroundColor: "#2563EB",
                          borderRadius: 1,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Button>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {/* Right side actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Notifications */}
              <IconButton
                sx={{
                  color: "#000000",
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications sx={{ fontSize: "1.5rem" }} />
                </Badge>
              </IconButton>

              {/* User Profile Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* User Name/Email Display - Hidden on extra small screens */}
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#000000",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.email || "Admin"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666666",
                      fontSize: "0.75rem",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {user?.is_superuser ? "Super Admin" : "Admin"}
                  </Typography>
                </Box>

                {/* User Avatar */}
                <Tooltip title="Open user settings">
                  <IconButton
                    onClick={handleProfileDrawerToggle}
                    sx={{
                      p: 0.5,
                      borderRadius: "14px",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Avatar
                      src={user?.profile_picture}
                      sx={{
                        width: { xs: 40, sm: 46 },
                        height: { xs: 40, sm: 46 },
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                      }}
                    >
                      {!user?.profile_picture &&
                        (user?.first_name?.[0] || user?.email?.[0] || "A")}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Enhanced Loading Bar */}
      {loading && (
        <LinearProgress
          sx={{
            height: "4px",
            position: "absolute",
            width: "100%",
            top: 0,
            zIndex: 1200,
            background: "rgba(37, 99, 235, 0.1)",
            "& .MuiLinearProgress-bar": {
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        />
      )}

      {/* Left Drawer */}
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={handleLeftDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "none",
          },
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          },
        }}
      >
        {leftDrawerContent}
      </Drawer>

      {/* Right Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={handleProfileDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "none",
          },
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          },
        }}
      >
        {profileDrawerContent}
      </Drawer>
    </>
  );
}

export default AdminNavbar;
