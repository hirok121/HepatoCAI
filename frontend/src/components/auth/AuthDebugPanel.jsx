import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Collapse,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  Person,
  Security,
  AccessTime,
  Logout,
  Minimize,
  Maximize,
  AdminPanelSettings,
  SupervisorAccount,
  Badge,
  AccountCircle,
  Email,
  CalendarToday,
  Verified,
  Language,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/AuthContext";

const AuthDebugPanel = () => {
  const { isAuthorized, user, logout } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  const getTokenFromStorage = () => {
    return (
      localStorage.getItem("access_token") || localStorage.getItem("access")
    );
  };

  const getRefreshTokenFromStorage = () => {
    return (
      localStorage.getItem("refresh_token") || localStorage.getItem("refresh")
    );
  };

  const getDecodedToken = () => {
    const token = getTokenFromStorage();
    if (token) {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };
  const handleClearAuth = () => {
    logout();
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getUserBadges = () => {
    const badges = [];
    if (user?.is_superuser) {
      badges.push(
        <Chip
          key="superuser"
          icon={<AdminPanelSettings />}
          label="Superuser"
          color="error"
          size="small"
          variant="filled"
        />
      );
    } else if (user?.is_staff) {
      badges.push(
        <Chip
          key="staff"
          icon={<SupervisorAccount />}
          label="Staff"
          color="warning"
          size="small"
          variant="filled"
        />
      );
    }

    if (user?.is_social_user) {
      badges.push(
        <Chip
          key="social"
          icon={<Language />}
          label={user.social_provider || "Social"}
          color="info"
          size="small"
          variant="outlined"
        />
      );
    }

    if (user?.verified_email) {
      badges.push(
        <Chip
          key="verified"
          icon={<Verified />}
          label="Verified"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }

    return badges;
  }; // Only show in development mode
  if (import.meta.env.MODE !== "development") {
    return null;
  }

  const token = getTokenFromStorage();
  const refreshToken = getRefreshTokenFromStorage();
  const decodedToken = getDecodedToken();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: isMinimized ? 250 : 450,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Card
        elevation={8}
        sx={{
          bgcolor: "grey.900",
          color: "white",
          borderRadius: 2,
          "& .MuiCardContent-root": {
            "&:last-child": { pb: 2 },
          },
        }}
      >
        <CardContent sx={{ p: isMinimized ? 1.5 : 2 }}>
          {/* Header with minimize button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: isMinimized ? 0 : 2,
            }}
          >
            <Typography
              variant={isMinimized ? "body2" : "h6"}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
              }}
            >
              <Security fontSize="small" />
              {!isMinimized && "Auth Debug Panel"}
            </Typography>
            <Tooltip title={isMinimized ? "Maximize" : "Minimize"}>
              <IconButton
                onClick={handleToggleMinimize}
                size="small"
                sx={{ color: "white", ml: 1 }}
              >
                {isMinimized ? <Maximize /> : <Minimize />}
              </IconButton>
            </Tooltip>
          </Box>

          <Collapse in={!isMinimized}>
            <Stack spacing={2}>
              {/* Authentication Status */}
              <Box>
                <Typography variant="body2" color="grey.300" gutterBottom>
                  Authentication Status
                </Typography>
                <Chip
                  icon={isAuthorized ? <Security /> : <Person />}
                  label={isAuthorized ? "Authenticated" : "Not Authenticated"}
                  color={isAuthorized ? "success" : "error"}
                  size="small"
                />
              </Box>

              {/* Enhanced User Information */}
              {user && (
                <Box>
                  <Typography variant="body2" color="grey.300" gutterBottom>
                    User Information
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <AccountCircle fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.full_name || user.username || "Unknown User"}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Email fontSize="small" />
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                        >
                          {user.email || "No email"}
                        </Typography>
                      </Box>
                    </Grid>

                    {user.user_id && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Badge fontSize="small" />
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                          >
                            ID: {user.user_id}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {(user.iat || user.exp) && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CalendarToday fontSize="small" />
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {user.iat &&
                              `Login: ${new Date(
                                user.iat * 1000
                              ).toLocaleString()}`}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  {/* User Badges */}
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}
                  >
                    {getUserBadges()}
                  </Box>
                </Box>
              )}

              <Divider sx={{ bgcolor: "grey.700" }} />

              {/* Token Details Accordion */}
              <Accordion
                elevation={0}
                sx={{
                  bgcolor: "transparent",
                  color: "white",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "white" }} />}
                  sx={{ p: 0, minHeight: "auto" }}
                >
                  <Typography variant="body2">Token Details</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 1 }}>
                  <Stack spacing={1}>
                    {token && (
                      <Box>
                        <Typography variant="caption" color="grey.400">
                          Access Token
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.7rem",
                            wordBreak: "break-all",
                            bgcolor: "grey.800",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          {token.substring(0, 60)}...
                        </Typography>
                      </Box>
                    )}

                    {refreshToken && (
                      <Box>
                        <Typography variant="caption" color="grey.400">
                          Refresh Token
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.7rem",
                            wordBreak: "break-all",
                            bgcolor: "grey.800",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          {refreshToken.substring(0, 60)}...
                        </Typography>
                      </Box>
                    )}

                    {decodedToken && (
                      <Box>
                        <Typography
                          variant="caption"
                          color="grey.400"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTime fontSize="small" />
                          Token Expiry
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {new Date(decodedToken.exp * 1000).toLocaleString()}
                        </Typography>

                        {/* Additional Token Info */}
                        <Typography variant="caption" color="grey.400">
                          Token Payload (Key Fields)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.7rem",
                            bgcolor: "grey.800",
                            p: 1,
                            borderRadius: 1,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {JSON.stringify(
                            {
                              user_id: decodedToken.user_id,
                              email: decodedToken.email,
                              is_staff: decodedToken.is_staff,
                              is_superuser: decodedToken.is_superuser,
                              is_active: decodedToken.is_active,
                              exp: decodedToken.exp,
                              iat: decodedToken.iat,
                            },
                            null,
                            2
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ bgcolor: "grey.700" }} />

              {/* Actions */}
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Logout />}
                onClick={handleClearAuth}
                fullWidth
              >
                Clear Auth Data
              </Button>
            </Stack>
          </Collapse>

          {/* Minimized view */}
          {isMinimized && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip
                icon={isAuthorized ? <Security /> : <Person />}
                label={isAuthorized ? "Auth" : "No Auth"}
                color={isAuthorized ? "success" : "error"}
                size="small"
              />
              {user && (
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {user.email?.split("@")[0] || user.username || "User"}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthDebugPanel;
