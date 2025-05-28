import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Paper,
} from "@mui/material";
import { useAuth } from "../AuthContext";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const DebugAuth = () => {
  const { user, isAuthorized, login, isStaff } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [credentials, setCredentials] = useState({
    email: "test@admin.com",
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

  const clearResults = () => setTestResults([]);

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        🔍 Authentication Debug Panel
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Current Auth State:</Typography>
        <Typography variant="body2">
          User: {user?.email || "Not logged in"}
        </Typography>
        <Typography variant="body2">
          Authorized: {String(isAuthorized)}
        </Typography>
        <Typography variant="body2">Staff: {String(isStaff)}</Typography>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        <TextField
          label="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          size="small"
        />
        <TextField
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
          size="small"
        />
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
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
        <Button onClick={clearResults} variant="outlined" size="small">
          Clear Results
        </Button>
      </Box>

      <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
        {testResults.map((result, index) => (
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
            <Typography variant="subtitle2" sx={{ fontSize: "0.8rem" }}>
              [{result.timestamp}] {result.test}: {result.result}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
              {result.details}
            </Typography>
          </Alert>
        ))}
      </Box>
    </Paper>
  );
};

export default DebugAuth;
