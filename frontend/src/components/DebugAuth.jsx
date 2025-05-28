import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { useAuth } from "../AuthContext";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const DebugAuth = () => {
  const { user, isAuthorized, login, isStaff } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [credentials, setCredentials] = useState({
    email: "admin@test.com",
    password: "admin123",
  });

  const addResult = (test, result, details = "") => {
    setTestResults((prev) => [
      ...prev,
      { test, result, details, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const testLogin = async () => {
    addResult("Login Test", "Starting...");
    try {
      const result = await login(credentials);
      addResult(
        "Login Test",
        result.success ? "SUCCESS" : "FAILED",
        result.error || "Login successful"
      );

      // Also test the raw token endpoint
      const rawResponse = await fetch("http://127.0.0.1:8000/accounts/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const rawData = await rawResponse.json();
      addResult(
        "Raw Token Endpoint",
        rawResponse.ok ? "SUCCESS" : "FAILED",
        JSON.stringify(rawData, null, 2)
      );
    } catch (error) {
      addResult("Login Test", "ERROR", error.message);
    }
  };

  const testProtectedEndpoint = async () => {
    addResult("Protected Endpoint Test", "Starting...");
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      addResult(
        "Token Check",
        token ? "FOUND" : "NOT FOUND",
        token ? `${token.substring(0, 50)}...` : "No token in localStorage"
      );

      const response = await api.get("/users/admin/users/");
      addResult(
        "Protected Endpoint Test",
        "SUCCESS",
        `Status: ${response.status}, Data: ${JSON.stringify(
          response.data
        ).substring(0, 200)}...`
      );
    } catch (error) {
      const errorMsg = error.response
        ? `${error.response.status}: ${
            error.response.statusText
          } - ${JSON.stringify(error.response.data)}`
        : error.message;
      addResult("Protected Endpoint Test", "FAILED", errorMsg);
    }
  };

  const testTokenStructure = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      addResult("Token Structure Test", "FAILED", "No access token found");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const importantFields = {
        user_id: payload.user_id,
        email: payload.email,
        is_staff: payload.is_staff,
        is_superuser: payload.is_superuser,
        exp: new Date(payload.exp * 1000).toLocaleString(),
        iat: new Date(payload.iat * 1000).toLocaleString(),
      };
      addResult(
        "Token Structure Test",
        "SUCCESS",
        JSON.stringify(importantFields, null, 2)
      );
    } catch (error) {
      addResult("Token Structure Test", "ERROR", error.message);
    }
  };

  const testDirectAPICall = async () => {
    addResult("Direct API Call", "Starting...");
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await fetch("http://127.0.0.1:8000/users/admin/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      addResult(
        "Direct API Call",
        response.ok ? "SUCCESS" : "FAILED",
        `Status: ${response.status}, Response: ${JSON.stringify(data).substring(
          0,
          200
        )}...`
      );
    } catch (error) {
      addResult("Direct API Call", "ERROR", error.message);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    addResult("Clear Storage", "SUCCESS", "Tokens cleared from localStorage");
  };

  return (
    <Paper sx={{ p: 2, m: 2, maxHeight: "80vh", overflow: "auto" }}>
      <Typography variant="h6">🔍 Authentication Debug Console</Typography>

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle2">Current Auth State:</Typography>
        <Typography>• Authorized: {isAuthorized ? "✅" : "❌"}</Typography>
        <Typography>• Is Staff: {isStaff ? "✅" : "❌"}</Typography>
        <Typography>
          • User: {user ? `${user.email} (ID: ${user.user_id})` : "None"}
        </Typography>
        <Typography>
          • Access Token:{" "}
          {localStorage.getItem(ACCESS_TOKEN) ? "✅ Present" : "❌ Missing"}
        </Typography>
        <Typography>
          • Refresh Token:{" "}
          {localStorage.getItem(REFRESH_TOKEN) ? "✅ Present" : "❌ Missing"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ my: 2 }}>
        <TextField
          label="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          fullWidth
          margin="normal"
          size="small"
        />
        <TextField
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
          fullWidth
          margin="normal"
          size="small"
        />
      </Box>

      <Box sx={{ my: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button onClick={testLogin} variant="contained" size="small">
          Test Login
        </Button>
        <Button
          onClick={testProtectedEndpoint}
          variant="contained"
          size="small"
        >
          Test Protected API
        </Button>
        <Button onClick={testDirectAPICall} variant="contained" size="small">
          Test Direct API
        </Button>
        <Button onClick={testTokenStructure} variant="contained" size="small">
          Check Token
        </Button>
        <Button onClick={clearStorage} variant="outlined" size="small">
          Clear Storage
        </Button>
        <Button
          onClick={() => setTestResults([])}
          variant="outlined"
          size="small"
        >
          Clear Results
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle2">🧪 Test Results:</Typography>
        <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
          {testResults.slice(-10).map((result, index) => (
            <Alert
              key={index}
              severity={
                result.result === "SUCCESS"
                  ? "success"
                  : result.result === "FAILED"
                  ? "error"
                  : "info"
              }
              sx={{ my: 1, fontSize: "0.8rem" }}
            >
              <Typography variant="subtitle2" sx={{ fontSize: "0.9rem" }}>
                {result.test}: {result.result} ({result.timestamp})
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
      </Box>
    </Paper>
  );
};

export default DebugAuth;
