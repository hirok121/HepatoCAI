import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../AuthContext";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const DebugAuthAdvanced = () => {
  const { user, isAuthorized, login, isStaff, loading } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [credentials, setCredentials] = useState({
    email: "test@admin.com",
    password: "admin123",
  });
  const [systemInfo, setSystemInfo] = useState({});
  useEffect(() => {
    checkSystemInfo();
  }, [checkSystemInfo]);

  const addResult = (test, result, details = "") => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults((prev) => [...prev, { test, result, details, timestamp }]);
    console.log(`[${timestamp}] ${test}: ${result}`, details);
  };
  const checkSystemInfo = useCallback(() => {
    const info = {
      localStorage_access: localStorage.getItem(ACCESS_TOKEN)
        ? "Present"
        : "Missing",
      localStorage_refresh: localStorage.getItem(REFRESH_TOKEN)
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
    };
    setSystemInfo(info);
  }, [user, isAuthorized, isStaff, loading]);

  const testFullAuthFlow = async () => {
    addResult(
      "🔄 Full Auth Flow",
      "STARTING",
      "Testing complete authentication flow..."
    );

    // Step 1: Clear existing auth
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    addResult("1️⃣ Clear Storage", "SUCCESS", "Cleared existing tokens");

    // Step 2: Test login
    try {
      addResult(
        "2️⃣ Login Attempt",
        "STARTING",
        `Logging in with ${credentials.email}`
      );
      const loginResult = await login(credentials);

      if (loginResult.success) {
        addResult(
          "2️⃣ Login Attempt",
          "SUCCESS",
          `Login successful: ${JSON.stringify(loginResult.user)}`
        );

        // Step 3: Check token storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
          addResult(
            "3️⃣ Token Storage",
            "SUCCESS",
            `Token stored: ${token.substring(0, 50)}...`
          );

          // Step 4: Decode token
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            addResult(
              "4️⃣ Token Decode",
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
              )
            );
          } catch (e) {
            addResult("4️⃣ Token Decode", "FAILED", `Error: ${e.message}`);
          }

          // Step 5: Test API call
          await testProtectedEndpoint();
        } else {
          addResult(
            "3️⃣ Token Storage",
            "FAILED",
            "No token found in localStorage after login"
          );
        }
      } else {
        addResult(
          "2️⃣ Login Attempt",
          "FAILED",
          loginResult.error || "Login failed"
        );
      }
    } catch (error) {
      addResult("2️⃣ Login Attempt", "ERROR", error.message);
    }
  };

  const testProtectedEndpoint = async () => {
    addResult(
      "5️⃣ Protected API",
      "STARTING",
      "Testing /users/admin/users/ endpoint"
    );
    try {
      const response = await api.get("/users/admin/users/");
      addResult(
        "5️⃣ Protected API",
        "SUCCESS",
        `Status: ${
          response.status
        }, Data type: ${typeof response.data}, Has 'status': ${
          "status" in response.data
        }`
      );

      if (response.data && response.data.status === "success") {
        addResult(
          "6️⃣ Response Structure",
          "SUCCESS",
          `Users count: ${
            response.data.data?.length || 0
          }, Permissions: ${JSON.stringify(response.data.permissions)}`
        );
      } else {
        addResult(
          "6️⃣ Response Structure",
          "WARNING",
          `Unexpected response structure: ${JSON.stringify(
            response.data
          ).substring(0, 200)}...`
        );
      }
    } catch (error) {
      const errorDetails = error.response
        ? `${error.response.status}: ${
            error.response.statusText
          } - ${JSON.stringify(error.response.data)}`
        : error.message;
      addResult("5️⃣ Protected API", "FAILED", errorDetails);
    }
  };

  const testDirectAPI = async () => {
    addResult("🌐 Direct API", "STARTING", "Testing with fetch API directly");
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        addResult("🌐 Direct API", "FAILED", "No token available");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/users/admin/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      addResult(
        "🌐 Direct API",
        response.ok ? "SUCCESS" : "FAILED",
        `Status: ${response.status}, Response: ${JSON.stringify(data).substring(
          0,
          200
        )}...`
      );
    } catch (error) {
      addResult("🌐 Direct API", "ERROR", error.message);
    }
  };

  const clearResults = () => setTestResults([]);

  return (
    <Paper sx={{ p: 2, m: 2, maxHeight: "90vh", overflow: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        🚀 Advanced Authentication Debug Console
      </Typography>

      <Grid container spacing={2}>
        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">📊 System Status</Typography>
              {Object.entries(systemInfo).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {String(value)}
                </Typography>
              ))}
              <Button onClick={checkSystemInfo} size="small" sx={{ mt: 1 }}>
                Refresh
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Auth Context Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">🔐 Auth Context</Typography>
              <Typography variant="body2">
                <strong>User:</strong>{" "}
                {user ? JSON.stringify(user, null, 2) : "null"}
              </Typography>
              <Typography variant="body2">
                <strong>Authorized:</strong> {String(isAuthorized)}
              </Typography>
              <Typography variant="body2">
                <strong>Staff:</strong> {String(isStaff)}
              </Typography>
              <Typography variant="body2">
                <strong>Loading:</strong> {String(loading)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Credentials */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">🔑 Test Credentials</Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
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
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button
              onClick={testFullAuthFlow}
              variant="contained"
              color="primary"
            >
              🔄 Test Full Auth Flow
            </Button>
            <Button
              onClick={testProtectedEndpoint}
              variant="contained"
              color="secondary"
            >
              🛡️ Test Protected API
            </Button>
            <Button onClick={testDirectAPI} variant="contained" color="info">
              🌐 Test Direct API
            </Button>
            <Button onClick={clearResults} variant="outlined">
              🗑️ Clear Results
            </Button>
          </Box>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                📝 Test Results ({testResults.length})
              </Typography>
              <Box sx={{ maxHeight: "400px", overflow: "auto", mt: 1 }}>
                {testResults.slice(-20).map((result, index) => (
                  <Alert
                    key={index}
                    severity={
                      result.result === "SUCCESS"
                        ? "success"
                        : result.result === "FAILED"
                        ? "error"
                        : result.result === "WARNING"
                        ? "warning"
                        : "info"
                    }
                    sx={{ my: 1, fontSize: "0.8rem" }}
                  >
                    <Typography variant="subtitle2" sx={{ fontSize: "0.9rem" }}>
                      [{result.timestamp}] {result.test}: {result.result}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ whiteSpace: "pre-wrap", fontSize: "0.75rem" }}
                    >
                      {result.details}
                    </Typography>
                  </Alert>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DebugAuthAdvanced;
