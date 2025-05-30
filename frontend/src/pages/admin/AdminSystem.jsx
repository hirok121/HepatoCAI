import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Security,
  Notifications,
  Backup,
  Update,
  Warning,
  CheckCircle,
  Error,
  Info,
  Save,
  RestartAlt,
  Download,
  Upload,
  Settings,
} from "@mui/icons-material";
import AdminNavbar from "../../components/admin/AdminNavbar";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function AdminSystem() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
  });

  const [settings, setSettings] = useState({
    security: {
      enforceStrongPasswords: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableEmailVerification: true,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: "INFO",
      backupFrequency: "daily",
      maxFileSize: 10,
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      userRegistrations: true,
      errorReports: true,
      weeklyReports: false,
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      apiRateLimit: 1000,
      maxConcurrentUsers: 500,
    },
  });
  const [systemStatus] = useState({
    services: [
      {
        name: "Database",
        status: "running",
        uptime: "15 days",
        health: "good",
      },
      {
        name: "API Server",
        status: "running",
        uptime: "15 days",
        health: "good",
      },
      {
        name: "Authentication",
        status: "running",
        uptime: "15 days",
        health: "excellent",
      },
      {
        name: "File Storage",
        status: "running",
        uptime: "15 days",
        health: "good",
      },
      {
        name: "Email Service",
        status: "running",
        uptime: "15 days",
        health: "warning",
      },
    ],
    lastBackup: "2025-05-28 02:00:00",
    diskUsage: 65,
    memoryUsage: 45,
    cpuUsage: 30,
  });

  useEffect(() => {
    fetchSystemSettings();
    fetchSystemStatus();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      // Mock API call - replace with real endpoint
      setMessage("Settings loaded successfully");
      setMessageType("success");
    } catch (error) {
      setMessage("Error loading settings");
      setMessageType("error");
    }
  };

  const fetchSystemStatus = async () => {
    try {
      // Mock API call - replace with real endpoint
      console.log("System status loaded");
    } catch (error) {
      console.error("Error loading system status:", error);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Settings saved successfully");
      setMessageType("success");
    } catch (error) {
      setMessage("Error saving settings");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const performAction = async (action) => {
    setLoading(true);
    try {
      switch (action) {
        case "backup":
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setMessage("System backup completed successfully");
          break;
        case "restart":
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setMessage("System restart initiated");
          break;
        case "maintenance":
          handleSettingChange(
            "system",
            "maintenanceMode",
            !settings.system.maintenanceMode
          );
          setMessage(
            `Maintenance mode ${
              settings.system.maintenanceMode ? "disabled" : "enabled"
            }`
          );
          break;
        default:
          setMessage("Action completed");
      }
      setMessageType("success");
    } catch (error) {
      setMessage(`Error performing ${action}`);
      setMessageType("error");
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, action: null });
    }
  };

  const getStatusColor = (health) => {
    switch (health) {
      case "excellent":
        return "success";
      case "good":
        return "primary";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <CheckCircle color="success" />;
      case "stopped":
        return <Error color="error" />;
      case "warning":
        return <Warning color="warning" />;
      default:
        return <Info />;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openConfirmDialog = (action) => {
    setConfirmDialog({ open: true, action });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminNavbar />
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            System Administration
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Backup />}
              onClick={() => openConfirmDialog("backup")}
              disabled={loading}
            >
              Backup Now
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={saveSettings}
              disabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </Box>

        {message && (
          <Alert
            severity={messageType}
            sx={{ mb: 3 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ width: "100%" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="System Status" icon={<CheckCircle />} />
            <Tab label="Security" icon={<Security />} />
            <Tab label="Performance" icon={<Update />} />
            <Tab label="Notifications" icon={<Notifications />} />
            <Tab label="Maintenance" icon={<Settings />} />
          </Tabs>

          {/* System Status Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* System Services */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Services
                    </Typography>
                    <List>
                      {systemStatus.services.map((service, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {getStatusIcon(service.status)}
                          </ListItemIcon>
                          <ListItemText
                            primary={service.name}
                            secondary={`Uptime: ${service.uptime}`}
                          />
                          <ListItemSecondaryAction>
                            <Chip
                              label={service.health}
                              color={getStatusColor(service.health)}
                              size="small"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Resource Usage */}
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Resource Usage
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">CPU Usage</Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <div
                            style={{
                              width: "100%",
                              height: 8,
                              backgroundColor: "#f0f0f0",
                              borderRadius: 4,
                            }}
                          >
                            <div
                              style={{
                                width: `${systemStatus.cpuUsage}%`,
                                height: "100%",
                                backgroundColor: "#1976d2",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                        </Box>
                        <Typography variant="body2">
                          {systemStatus.cpuUsage}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">Memory Usage</Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <div
                            style={{
                              width: "100%",
                              height: 8,
                              backgroundColor: "#f0f0f0",
                              borderRadius: 4,
                            }}
                          >
                            <div
                              style={{
                                width: `${systemStatus.memoryUsage}%`,
                                height: "100%",
                                backgroundColor: "#2e7d32",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                        </Box>
                        <Typography variant="body2">
                          {systemStatus.memoryUsage}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2">Disk Usage</Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ width: "100%", mr: 1 }}>
                          <div
                            style={{
                              width: "100%",
                              height: 8,
                              backgroundColor: "#f0f0f0",
                              borderRadius: 4,
                            }}
                          >
                            <div
                              style={{
                                width: `${systemStatus.diskUsage}%`,
                                height: "100%",
                                backgroundColor:
                                  systemStatus.diskUsage > 80
                                    ? "#d32f2f"
                                    : "#ed6c02",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                        </Box>
                        <Typography variant="body2">
                          {systemStatus.diskUsage}%
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Last Backup: {systemStatus.lastBackup}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Authentication Security
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.security.enforceStrongPasswords}
                            onChange={(e) =>
                              handleSettingChange(
                                "security",
                                "enforceStrongPasswords",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Enforce Strong Passwords"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.security.enableTwoFactor}
                            onChange={(e) =>
                              handleSettingChange(
                                "security",
                                "enableTwoFactor",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Enable Two-Factor Authentication"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.security.enableEmailVerification}
                            onChange={(e) =>
                              handleSettingChange(
                                "security",
                                "enableEmailVerification",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Require Email Verification"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Session & Access Control
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        label="Session Timeout (minutes)"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "sessionTimeout",
                            parseInt(e.target.value)
                          )
                        }
                        size="small"
                      />
                      <TextField
                        label="Max Login Attempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "maxLoginAttempts",
                            parseInt(e.target.value)
                          )
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Performance Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Caching & Optimization
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.performance.cacheEnabled}
                            onChange={(e) =>
                              handleSettingChange(
                                "performance",
                                "cacheEnabled",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Enable Caching"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.performance.compressionEnabled}
                            onChange={(e) =>
                              handleSettingChange(
                                "performance",
                                "compressionEnabled",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Enable Compression"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Rate Limiting
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        label="API Rate Limit (requests/hour)"
                        type="number"
                        value={settings.performance.apiRateLimit}
                        onChange={(e) =>
                          handleSettingChange(
                            "performance",
                            "apiRateLimit",
                            parseInt(e.target.value)
                          )
                        }
                        size="small"
                      />
                      <TextField
                        label="Max Concurrent Users"
                        type="number"
                        value={settings.performance.maxConcurrentUsers}
                        onChange={(e) =>
                          handleSettingChange(
                            "performance",
                            "maxConcurrentUsers",
                            parseInt(e.target.value)
                          )
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Notifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) =>
                            handleSettingChange(
                              "notifications",
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.systemAlerts}
                          onChange={(e) =>
                            handleSettingChange(
                              "notifications",
                              "systemAlerts",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="System Alerts"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.userRegistrations}
                          onChange={(e) =>
                            handleSettingChange(
                              "notifications",
                              "userRegistrations",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="User Registration Alerts"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.errorReports}
                          onChange={(e) =>
                            handleSettingChange(
                              "notifications",
                              "errorReports",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Error Reports"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.weeklyReports}
                          onChange={(e) =>
                            handleSettingChange(
                              "notifications",
                              "weeklyReports",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Weekly Reports"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Maintenance Tab */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Maintenance
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.system.maintenanceMode}
                            onChange={(e) =>
                              handleSettingChange(
                                "system",
                                "maintenanceMode",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Maintenance Mode"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.system.debugMode}
                            onChange={(e) =>
                              handleSettingChange(
                                "system",
                                "debugMode",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Debug Mode"
                      />
                      <TextField
                        label="Max File Size (MB)"
                        type="number"
                        value={settings.system.maxFileSize}
                        onChange={(e) =>
                          handleSettingChange(
                            "system",
                            "maxFileSize",
                            parseInt(e.target.value)
                          )
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Actions
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={() => openConfirmDialog("restart")}
                        disabled={loading}
                        fullWidth
                      >
                        Restart System
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => openConfirmDialog("backup")}
                        disabled={loading}
                        fullWidth
                      >
                        Create Backup
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Upload />}
                        disabled={loading}
                        fullWidth
                      >
                        Restore from Backup
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, action: null })}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {confirmDialog.action}? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog({ open: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => performAction(confirmDialog.action)}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default AdminSystem;
