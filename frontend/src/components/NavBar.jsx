import React, { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import { Link as RouterLink } from "react-router-dom";

// Icons - Updated with more appropriate medical/health icons
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArticleIcon from "@mui/icons-material/Article";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HelpIcon from "@mui/icons-material/Help";
import ForumIcon from "@mui/icons-material/Forum";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAuth } from "../AuthContext";
import { HepatoCAIIcon } from "./CustomIcons.tsx";

// Add LinkBehavior component before menuItems
const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI standard) -> to (react-router standard)
  return <RouterLink ref={ref} to={href} {...other} />;
});

function NavBar() {
  const navigate = useNavigate();
  // Destructure `loading` from useAuth
  const {
    isAuthorized,
    isStaff,
    logout: authLogout,
    login: authLogin,
    user,
    loading,
  } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);

  const handleLeftDrawerToggle = () => setLeftDrawerOpen(!leftDrawerOpen);
  const handleRightDrawerToggle = () => setRightDrawerOpen(!rightDrawerOpen);
  const handleProfileMenuOpen = (event) =>
    setProfileMenuAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchorEl(null);

  const handleLogout = () => {
    authLogout();
    handleProfileMenuClose();
    if (isMobile) handleRightDrawerToggle();
    navigate("/");
  };

  // Filter menu items based on user status
  const getMenuItems = () => {
    const baseMenuItems = [
      { label: "Home", path: "/", icon: <HomeIcon /> },
      {
        label: "Diagnosis Tool",
        path: "/diagnosis",
        icon: <MedicalServicesIcon />,
      },
      {
        label: "AI Assistant",
        path: "/ai-assistant",
        icon: <PsychologyIcon />,
        featured: true,
      },
      {
        label: "Patient Education",
        path: "/patient-education",
        icon: <ArticleIcon />,
      },
      { label: "Research", path: "/research", icon: <LibraryBooksIcon /> },
      { label: "FAQ", path: "/faq", icon: <HelpIcon /> },
      { label: "Community Forum", path: "/community", icon: <ForumIcon /> },
      { label: "About Us", path: "/about", icon: <InfoIcon /> },
      { label: "Contact Us", path: "/contact", icon: <ContactSupportIcon /> },
    ]; // Only add Admin Console if user is staff
    if (isStaff) {
      baseMenuItems.push({
        label: "Admin Console",
        path: "/admin",
        icon: <AdminPanelSettingsIcon />,
      });
    }

    return baseMenuItems;
  };

  const menuItems = getMenuItems();

  // Enhanced listDrawerItems with smaller text and AI Assistant color
  const listDrawerItems = (items, onDrawerClose) => (
    <Box sx={{ width: 260 }} role="presentation">
      {/* Enhanced Header */}
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
            fontSize: "1rem", // Reduced from 1.25rem
            color: "#000000",
          }}
        >
          Menu
        </Typography>
        <IconButton
          onClick={onDrawerClose}
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

      {/* Enhanced Navigation Items */}
      <List sx={{ py: 1 }}>
        {items.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            component={LinkBehavior}
            to={item.path}
            onClick={onDrawerClose}
          >
            <ListItemButton
              sx={{
                py: 1.2, // Reduced padding
                px: 3,
                "&:hover": {
                  backgroundColor:
                    item.label === "AI Assistant"
                      ? "rgba(37, 99, 235, 0.08)"
                      : "rgba(37, 99, 235, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.label === "AI Assistant" ? "#2563EB" : "#000000",
                  minWidth: "40px", // Reduced from 44px
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.2rem", // Reduced from 1.4rem
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: "0.95rem", // Reduced from 1.1rem
                  color: item.label === "AI Assistant" ? "#2563EB" : "#000000",
                }}
              />
              {(item.label === "Diagnosis Tool" ||
                item.label === "AI Assistant") && (
                <Chip
                  label="New"
                  size="small"
                  sx={{
                    height: 18, // Reduced from 20
                    fontSize: "0.6rem", // Reduced from 0.7rem
                    backgroundColor:
                      item.label === "AI Assistant"
                        ? "#2563EB"
                        : theme.palette.primary.main,
                    color: "white",
                    fontWeight: 700,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}

        {/* Enhanced Auth Buttons for Mobile */}
        {isMobile && !isAuthorized && (
          <>
            <Box
              sx={{
                mx: 2,
                my: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                pt: 2,
              }}
            >
              <Button
                component={LinkBehavior}
                to="/login"
                fullWidth
                onClick={onDrawerClose}
                startIcon={<LoginIcon />}
                sx={{
                  mb: 1,
                  backgroundColor: "#000000",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9rem", // Reduced from 1rem
                  py: 1.2, // Reduced from 1.5
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={LinkBehavior}
                to="/register"
                fullWidth
                onClick={onDrawerClose}
                startIcon={<PersonAddIcon />}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9rem", // Reduced from 1rem
                  py: 1.2, // Reduced from 1.5
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </>
        )}
      </List>
    </Box>
  );

  // Enhanced profileMenuItems with improved styling
  const profileMenuItems = [
    {
      label: "Profile",
      path: "/profile",
      icon: <PersonIcon />,
      action: () => navigate("/profile"),
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
      action: () => navigate("/dashboard"),
    },
    { label: "Logout", icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <>
      {/* Enhanced AppBar */}
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
            {/* Left Menu Icon (Mobile) */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open navigation drawer"
              sx={{
                mr: 1,
                display: { md: "none" },
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
              component={LinkBehavior}
              to="/"
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
            {/* Enhanced Desktop Navigation Links */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {menuItems.slice(0, 5).map((item) => (
                <Box key={item.label} sx={{ position: "relative" }}>
                  <Button
                    component={LinkBehavior}
                    to={item.path}
                    sx={{
                      color:
                        item.label === "AI Assistant" ? "#2563EB" : "#000000",
                      mx: 0.5,
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      position: "relative",
                      "&:hover": {
                        backgroundColor:
                          item.label === "AI Assistant"
                            ? "rgba(37, 99, 235, 0.08)"
                            : "rgba(37, 99, 235, 0.08)",
                        transform: "translateY(-2px)",
                        "& .nav-underline": {
                          width: "100%",
                        },
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.label}
                    {item.featured && (
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          height: 16,
                          fontSize: "0.55rem",
                          backgroundColor:
                            item.label === "AI Assistant"
                              ? "#2563EB"
                              : theme.palette.primary.main,
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <Box
                      className="nav-underline"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 2,
                        backgroundColor:
                          item.label === "AI Assistant"
                            ? "#2563EB"
                            : theme.palette.primary.main,
                        borderRadius: 1,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Button>
                </Box>
              ))}
              {menuItems.length > 5 && (
                <Button
                  sx={{
                    color: "#000000",
                    mx: 0.5,
                    px: 2,
                    py: 1,
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleLeftDrawerToggle}
                >
                  More...
                </Button>
              )}
            </Box>
            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />{" "}
            {/* Enhanced Right Side: Auth Buttons or User Icons */}
            {isAuthorized ? (
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
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon sx={{ fontSize: "1.5rem" }} />
                  </Badge>
                </IconButton>

                {/* User Profile Section with Name/Email */}
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
                      {user?.full_name ||
                        user?.email ||
                        user?.username ||
                        "User"}
                    </Typography>
                    {user?.full_name && user?.email && (
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
                        {user.email}
                      </Typography>
                    )}
                  </Box>

                  {/* User Avatar */}
                  <Tooltip title="Open user settings">
                    <IconButton
                      onClick={
                        isMobile
                          ? handleRightDrawerToggle
                          : handleProfileMenuOpen
                      }
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
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          width: { xs: 40, sm: 46 },
                          height: { xs: 40, sm: 46 },
                          color: "white",
                          fontWeight: 700,
                          fontSize: "1.2rem",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                        }}
                        alt={user?.full_name || user?.email || "User"}
                        src={user?.profile_picture || undefined}
                      >
                        {user?.full_name ? (
                          user.full_name.charAt(0).toUpperCase()
                        ) : user?.email ? (
                          user.email.charAt(0).toUpperCase()
                        ) : (
                          <AccountCircleIcon sx={{ fontSize: "1.5rem" }} />
                        )}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {/* Enhanced Login Button */}
                <Button
                  component={LinkBehavior}
                  to="/signin"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "white",
                    backgroundColor: "#000000",
                    borderRadius: "12px",
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: "0.9rem", // Reduced from 1.05rem
                    "&:hover": {
                      backgroundColor: "#333333",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign In
                </Button>

                {/* Enhanced Register Button */}
                <Button
                  component={LinkBehavior}
                  to="/signup"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    color: "white",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: "12px",
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: "0.9rem", // Reduced from 1.05rem
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
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
        {listDrawerItems(menuItems, handleLeftDrawerToggle)}
      </Drawer>

      {/* Enhanced Right Drawer (Profile) */}
      {isAuthorized && isMobile && (
        <Drawer
          anchor="right"
          open={rightDrawerOpen}
          onClose={handleRightDrawerToggle}
          PaperProps={{
            sx: {
              width: 260,
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
          <Box role="presentation">
            {/* Enhanced Profile Header */}
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
                onClick={handleRightDrawerToggle}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#000000",
                }}
              >
                <CloseIcon />
              </IconButton>{" "}
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
                alt={user?.full_name || user?.email || "User"}
                src={user?.profile_picture || undefined}
              >
                {user?.full_name ? (
                  user.full_name.charAt(0).toUpperCase()
                ) : user?.email ? (
                  user.email.charAt(0).toUpperCase()
                ) : (
                  <AccountCircleIcon sx={{ fontSize: "2rem" }} />
                )}
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: "1rem", // Reduced from 1.2rem
                  color: "#000000",
                }}
              >
                {user?.full_name || user?.email || "Welcome User"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#000000",
                  fontWeight: 600,
                  fontSize: "0.8rem", // Added smaller font size
                }}
              >
                {user?.email || "user@example.com"}
              </Typography>
            </Box>

            {/* Enhanced Profile Menu Items */}
            <List sx={{ py: 1 }}>
              {profileMenuItems.map((item) => (
                <ListItem
                  key={item.label}
                  disablePadding
                  onClick={() => {
                    item.action();
                    handleRightDrawerToggle();
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
                        fontSize: "0.95rem", // Reduced from 1.1rem
                        color: item.label === "Logout" ? "#EF4444" : "#000000",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      {/* Enhanced Desktop Profile Menu */}
      {isAuthorized && !isMobile && (
        <Menu
          id="profile-menu-appbar"
          anchorEl={profileMenuAnchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(profileMenuAnchorEl)}
          onClose={handleProfileMenuClose}
          sx={{ mt: "8px" }}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: "blur(10px)",
              minWidth: 200,
              "&::before": {
                content: '""',
                position: "absolute",
                top: -8,
                right: 20,
                width: 16,
                height: 16,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderBottom: "none",
                borderRight: "none",
                transform: "rotate(45deg)",
              },
            },
          }}
        >
          {profileMenuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                item.action();
                handleProfileMenuClose();
              }}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    item.label === "Logout"
                      ? "rgba(239, 68, 68, 0.08)"
                      : "rgba(37, 99, 235, 0.08)",
                  transform: "scale(1.02)",
                },
                "&:first-of-type": {
                  mt: 1,
                },
                "&:last-of-type": {
                  mb: 1,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: item.label === "Logout" ? "#EF4444" : "#000000",
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.3rem",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: "0.9rem", // Reduced from 1rem
                  color: item.label === "Logout" ? "#EF4444" : "#000000",
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}

export default NavBar;
