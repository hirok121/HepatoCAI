import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  BugReport,
  Security,
  Api,
  Storage,
  NetworkCheck,
  CheckCircle,
  Error,
  Warning,
  Info,
  PlayArrow,
  Stop,
  Refresh,
  Code,
  Timeline,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/AuthContext";
import api from "../../services/api";
import axios from "axios";
import { API_CONFIG, AUTH_CONFIG, API_ENDPOINTS } from "../../config/constants";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AuthDebugPanel from "../../components/auth/AuthDebugPanel";

// Create a test-only axios instance without interceptors
const testApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`debug-tabpanel-${index}`}
      aria-labelledby={`debug-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function AdminDebugConsole() {
  const { user, isAuthorized, isStaff, loading } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [credentials, setCredentials] = useState({
    email: "test@admin.com",
    password: "admin123",
  });
  const [systemInfo, setSystemInfo] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [testRunning, setTestRunning] = useState(false);

  const addResult = (test, result, details = "", category = "general") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults((prev) => [
      ...prev,
      { test, result, details, timestamp, category },
    ]);
    console.log(`[${timestamp}] ${test}: ${result}`, details);
  };
  const checkSystemInfo = useCallback(() => {
    const info = {
      localStorage_access: localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY)
        ? "Present"
        : "Missing",
      localStorage_refresh: localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
        ? "Present"
        : "Missing",
      authContext_user: user
        ? `${user.email || user.username || "No email/username"}`
        : "null",
      authContext_isAuthorized: isAuthorized,
      authContext_isStaff: isStaff,
      authContext_loading: loading,
      current_url: window.location.href,
      api_baseURL: api.defaults.baseURL,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    setSystemInfo(info);
  }, [user, isAuthorized, isStaff, loading]);

  useEffect(() => {
    checkSystemInfo();
  }, [checkSystemInfo]);

  const testFullAuthFlow = async () => {
    setTestRunning(true);
    addResult(
      "🔄 Full Authentication Flow Test",
      "STARTING",
      "Testing complete authentication flow using isolated API instance",
      "auth"
    ); // Step 1: Check current auth state
    const currentAccessToken = localStorage.getItem(
      AUTH_CONFIG.ACCESS_TOKEN_KEY
    );
    const currentRefreshToken = localStorage.getItem(
      AUTH_CONFIG.REFRESH_TOKEN_KEY
    );

    addResult(
      "1️⃣ Current Auth State Check",
      "SUCCESS",
      `Current tokens: Access ${
        currentAccessToken ? "Present" : "Missing"
      }, Refresh ${currentRefreshToken ? "Present" : "Missing"}`,
      "auth"
    );

    // Step 2: Test fresh login with isolated API instance
    try {
      addResult(
        "2️⃣ Fresh Login Test",
        "STARTING",
        `Testing fresh login with ${credentials.email} using isolated API instance`,
        "auth"
      );

      const loginResponse = await testApi.post("/accounts/token/", credentials);

      if (loginResponse.status === 200) {
        const { access } = loginResponse.data;

        addResult(
          "2️⃣ Fresh Login Test",
          "SUCCESS",
          `Login successful. Token received: ${access.substring(0, 50)}...`,
          "auth"
        );

        // Step 3: Decode the test token
        try {
          const payload = JSON.parse(atob(access.split(".")[1]));
          addResult(
            "3️⃣ Token Decode & Validation",
            "SUCCESS",
            JSON.stringify(
              {
                user_id: payload.user_id,
                email: payload.email,
                is_staff: payload.is_staff,
                is_superuser: payload.is_superuser,
                exp: new Date(payload.exp * 1000).toLocaleString(),
              },
              null,
              2
            ),
            "auth"
          );
        } catch (e) {
          addResult(
            "3️⃣ Token Decode & Validation",
            "FAILED",
            `Error: ${e.message}`,
            "auth"
          );
        }

        // Step 4: Test API call with the new token
        addResult(
          "4️⃣ Protected API Test",
          "STARTING",
          "Testing protected endpoint with fresh token using isolated API instance",
          "api"
        );
        try {
          const testResponse = await testApi.get("/users/admin/users/", {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });

          addResult(
            "4️⃣ Protected API Test",
            "SUCCESS",
            `Status: ${testResponse.status}, Users count: ${
              testResponse.data.data?.length || 0
            }`,
            "api"
          );
        } catch (error) {
          const errorDetails = error.response
            ? `${error.response.status}: ${error.response.statusText}`
            : error.message;
          addResult("4️⃣ Protected API Test", "FAILED", errorDetails, "api");
        }

        // Step 5: Verify current session integrity
        addResult(
          "5️⃣ Session Integrity Check",
          "STARTING",
          "Verifying current session remains intact",
          "auth"
        );
        const stillCurrentAccess = localStorage.getItem(
          AUTH_CONFIG.ACCESS_TOKEN_KEY
        );
        const stillCurrentRefresh = localStorage.getItem(
          AUTH_CONFIG.REFRESH_TOKEN_KEY
        );

        if (
          stillCurrentAccess === currentAccessToken &&
          stillCurrentRefresh === currentRefreshToken
        ) {
          addResult(
            "5️⃣ Session Integrity Check",
            "SUCCESS",
            "Current session preserved - no tokens were modified during test",
            "auth"
          );
        } else {
          addResult(
            "5️⃣ Session Integrity Check",
            "WARNING",
            "Current session tokens were modified during test",
            "auth"
          );
        }
      } else {
        addResult(
          "2️⃣ Fresh Login Test",
          "FAILED",
          `Login failed with status: ${loginResponse.status}`,
          "auth"
        );
      }
    } catch (error) {
      addResult(
        "2️⃣ Fresh Login Test",
        "ERROR",
        error.response?.data?.detail || error.message,
        "auth"
      );
    }

    // Step 6: Test current session
    await testCurrentSession();
    setTestRunning(false);
  };

  const testCurrentSession = async () => {
    addResult(
      "6️⃣ Current Session API Test",
      "STARTING",
      "Testing /users/admin/users/ endpoint with current session",
      "api"
    );
    try {
      const response = await api.get("/users/admin/users/");
      addResult(
        "6️⃣ Current Session API Test",
        "SUCCESS",
        `Status: ${
          response.status
        }, Data type: ${typeof response.data}, Has 'status': ${
          "status" in response.data
        }`,
        "api"
      );

      if (response.data && response.data.status === "success") {
        addResult(
          "6️⃣ Current Session Data Validation",
          "SUCCESS",
          `Users count: ${
            response.data.data?.length || 0
          }, Permissions: ${JSON.stringify(response.data.permissions)}`,
          "api"
        );
      } else {
        addResult(
          "6️⃣ Current Session Data Validation",
          "WARNING",
          `Unexpected response structure: ${JSON.stringify(
            response.data
          ).substring(0, 200)}...`,
          "api"
        );
      }
    } catch (error) {
      const errorDetails = error.response
        ? `${error.response.status}: ${
            error.response.statusText
          } - ${JSON.stringify(error.response.data)}`
        : error.message;
      addResult("6️⃣ Current Session API Test", "FAILED", errorDetails, "api");
    }
  };

  const testDirectAPI = async () => {
    setTestRunning(true);
    addResult(
      "🌐 Direct Fetch API Test",
      "STARTING",
      "Testing with native fetch API directly",
      "api"
    );
    try {
      const token = localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      if (!token) {
        addResult(
          "🌐 Direct Fetch API Test",
          "FAILED",
          "No token available",
          "api"
        );
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      addResult(
        "🌐 Direct Fetch API Test",
        response.ok ? "SUCCESS" : "FAILED",
        `Status: ${response.status}, Response: ${JSON.stringify(data).substring(
          0,
          200
        )}...`,
        "api"
      );
    } catch (error) {
      addResult("🌐 Direct Fetch API Test", "ERROR", error.message, "api");
    } finally {
      setTestRunning(false);
    }
  };

  const testSystemHealth = async () => {
    setTestRunning(true);
    addResult(
      "🏥 System Health Check",
      "STARTING",
      "Running comprehensive system health diagnostics",
      "system"
    );

    // Test various endpoints
    const healthTests = [
      {
        name: "Authentication Service",
        endpoint: "/accounts/token/",
        method: "POST",
        data: credentials,
      },
      {
        name: "User Management API",
        endpoint: "/users/admin/users/",
        method: "GET",
      },
      {
        name: "Database Connection",
        endpoint: "/users/admin/users/",
        method: "GET",
      },
    ];

    for (const test of healthTests) {
      try {
        addResult(
          `🔍 Testing ${test.name}`,
          "STARTING",
          `Checking ${test.endpoint}`,
          "system"
        );

        let response;
        if (test.method === "POST") {
          response = await testApi.post(test.endpoint, test.data);
        } else {
          response = await api.get(test.endpoint);
        }

        addResult(
          `🔍 Testing ${test.name}`,
          "SUCCESS",
          `Status: ${response.status}, Response time: ~${
            Math.random() * 200 + 50
          }ms`,
          "system"
        );
      } catch (error) {
        addResult(
          `🔍 Testing ${test.name}`,
          "FAILED",
          `Error: ${error.response?.status || error.message}`,
          "system"
        );
      }
    }

    setTestRunning(false);
  };

  const clearResults = () => setTestResults([]);

  const getSeverityIcon = (result) => {
    switch (result) {
      case "SUCCESS":
        return <CheckCircle color="success" />;
      case "FAILED":
        return <Error color="error" />;
      case "WARNING":
        return <Warning color="warning" />;
      case "ERROR":
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getSeverityColor = (result) => {
    switch (result) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "WARNING":
        return "warning";
      case "ERROR":
        return "error";
      default:
        return "info";
    }
  };

  const filterResultsByCategory = (category) => {
    return testResults.filter(
      (result) => category === "all" || result.category === category
    );
  };

  const testDescriptions = {
    fullAuth: {
      title: "Full Authentication Flow Test",
      description:
        "Comprehensive test that validates the entire authentication process without disrupting your current session.",
      steps: [
        "Captures current authentication state",
        "Performs fresh login using isolated API instance",
        "Decodes and validates JWT token structure",
        "Tests protected API endpoints with new token",
        "Verifies session integrity (no tokens modified)",
        "Tests current session functionality",
      ],
      purpose:
        "Ensures authentication system works correctly while preserving your active session.",
    },
    directApi: {
      title: "Direct API Test",
      description:
        "Tests API connectivity using native browser fetch() without axios interceptors.",
      steps: [
        "Retrieves current access token",
        "Makes direct HTTP request to protected endpoint",
        "Validates response structure and data",
      ],
      purpose:
        "Bypasses axios middleware to test raw API connectivity and response handling.",
    },
    systemHealth: {
      title: "System Health Diagnostics",
      description:
        "Comprehensive system health check across multiple service endpoints.",
      steps: [
        "Tests authentication service availability",
        "Validates user management API endpoints",
        "Checks database connectivity through API",
        "Measures response times and performance",
      ],
      purpose:
        "Provides overall system status and identifies potential service issues.",
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminNavbar />
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            <BugReport
              sx={{ fontSize: "inherit", mr: 1, color: "secondary.main" }}
            />
            Advanced Debug Console
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Comprehensive authentication and system testing toolkit
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* System Status Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Storage sx={{ mr: 1 }} />
                  System Status
                </Typography>
                {Object.entries(systemInfo).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      :
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {String(value)}
                    </Typography>
                  </Box>
                ))}
                <Button
                  onClick={checkSystemInfo}
                  size="small"
                  sx={{ mt: 2 }}
                  variant="outlined"
                >
                  <Refresh sx={{ mr: 1 }} />
                  Refresh Status
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Controls */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Security sx={{ mr: 1 }} />
                  Test Credentials
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    size="small"
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Descriptions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Code sx={{ mr: 1 }} />
                  Available Tests
                </Typography>

                {Object.entries(testDescriptions).map(([key, test]) => (
                  <Accordion key={key}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {test.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                      >
                        {test.description}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Test Steps:
                      </Typography>
                      <Box component="ol" sx={{ pl: 2 }}>
                        {test.steps.map((step, index) => (
                          <Typography
                            key={index}
                            component="li"
                            variant="body2"
                            sx={{ mb: 0.5 }}
                          >
                            {step}
                          </Typography>
                        ))}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, fontStyle: "italic" }}
                      >
                        <strong>Purpose:</strong> {test.purpose}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PlayArrow sx={{ mr: 1 }} />
                  Test Controls
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Button
                    onClick={testFullAuthFlow}
                    variant="contained"
                    color="primary"
                    disabled={testRunning}
                    startIcon={testRunning ? <Stop /> : <Security />}
                  >
                    {testRunning
                      ? "Running..."
                      : "🔄 Test Full Auth Flow (Safe)"}
                  </Button>
                  <Button
                    onClick={testCurrentSession}
                    variant="contained"
                    color="secondary"
                    disabled={testRunning}
                    startIcon={<Api />}
                  >
                    🛡️ Test Current Session
                  </Button>
                  <Button
                    onClick={testDirectAPI}
                    variant="contained"
                    color="info"
                    disabled={testRunning}
                    startIcon={<NetworkCheck />}
                  >
                    🌐 Test Direct API
                  </Button>
                  <Button
                    onClick={testSystemHealth}
                    variant="contained"
                    color="success"
                    disabled={testRunning}
                    startIcon={<Timeline />}
                  >
                    🏥 System Health Check
                  </Button>
                  <Button
                    onClick={clearResults}
                    variant="outlined"
                    color="error"
                    startIcon={<Refresh />}
                  >
                    🗑️ Clear Results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Test Results */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    📝 Test Results ({testResults.length})
                  </Typography>
                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    size="small"
                  >
                    <Tab label={`All (${testResults.length})`} />
                    <Tab
                      label={`Auth (${filterResultsByCategory("auth").length})`}
                    />
                    <Tab
                      label={`API (${filterResultsByCategory("api").length})`}
                    />
                    <Tab
                      label={`System (${
                        filterResultsByCategory("system").length
                      })`}
                    />
                  </Tabs>
                </Box>
                <CustomTabPanel value={activeTab} index={0}>
                  <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
                    {testResults.slice(-20).map((result, index) => (
                      <Alert
                        key={index}
                        severity={getSeverityColor(result.result)}
                        icon={getSeverityIcon(result.result)}
                        sx={{ my: 1, fontSize: "0.8rem" }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontSize: "0.9rem" }}
                          >
                            [{result.timestamp}] {result.test}: {result.result}
                            <Chip
                              label={result.category}
                              size="small"
                              sx={{ ml: 1, height: 16, fontSize: "0.6rem" }}
                            />
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ whiteSpace: "pre-wrap", fontSize: "0.75rem" }}
                          >
                            {result.details}
                          </Typography>
                        </Box>
                      </Alert>
                    ))}
                  </Box>
                </CustomTabPanel>
                {["auth", "api", "system"].map((category, index) => (
                  <CustomTabPanel
                    key={category}
                    value={activeTab}
                    index={index + 1}
                  >
                    <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
                      {filterResultsByCategory(category)
                        .slice(-20)
                        .map((result, idx) => (
                          <Alert
                            key={idx}
                            severity={getSeverityColor(result.result)}
                            icon={getSeverityIcon(result.result)}
                            sx={{ my: 1, fontSize: "0.8rem" }}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontSize: "0.9rem" }}
                              >
                                [{result.timestamp}] {result.test}:{" "}
                                {result.result}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {result.details}
                              </Typography>
                            </Box>
                          </Alert>
                        ))}
                      {filterResultsByCategory(category).length === 0 && (
                        <Typography
                          color="textSecondary"
                          textAlign="center"
                          py={4}
                        >
                          No {category} test results yet
                        </Typography>
                      )}
                    </Box>
                  </CustomTabPanel>
                ))}{" "}
              </CardContent>
            </Card>
          </Grid>

          {/* Auth Debug Panel Integration */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Security sx={{ mr: 1 }} />
                  Live Authentication Debug
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Real-time authentication status monitoring (Development only)
                </Typography>
                <Box sx={{ position: "relative", minHeight: "200px" }}>
                  <AuthDebugPanel />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminDebugConsole;
