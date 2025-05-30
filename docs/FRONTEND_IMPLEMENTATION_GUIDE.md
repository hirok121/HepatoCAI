may note :
i dont want comapre test
dont delete or update

# HepatoCAI Frontend Implementation Guide

## Table of Contents

1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [API Integration Patterns](#api-integration-patterns)
4. [State Management](#state-management)
5. [UI Components & Pages](#ui-components--pages)
6. [Form Handling](#form-handling)
7. [Data Visualization](#data-visualization)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Best Practices](#best-practices)

## Overview

This guide provides comprehensive implementation suggestions for the HepatoCAI frontend, focusing on React.js with Material-UI, efficient API integration, and optimal user experience.

### Technology Stack

- **React 18+** with Hooks
- **Material-UI (MUI) 5+** for components
- **React Router** for navigation
- **Axios** for API calls
- **React Query/SWR** for data fetching (recommended)
- **React Hook Form** for form management
- **Chart.js/Recharts** for data visualization

## Component Architecture

### 1. Folder Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx
│   │   ├── Navigation.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── LoadingSpinner.jsx
│   ├── diagnosis/
│   │   ├── DiagnosisForm.jsx
│   │   ├── DiagnosisCard.jsx
│   │   ├── DiagnosisResultModal.jsx
│   │   ├── DiagnosisSearch.jsx
│   │   ├── DiagnosisComparison.jsx
│   │   └── DiagnosisFilters.jsx
│   ├── analytics/
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── ChartsContainer.jsx
│   │   ├── StatCard.jsx
│   │   └── TrendChart.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── UserManagement.jsx
│       └── SystemMetrics.jsx
├── pages/
│   ├── DiagnosisPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── ProfilePage.jsx
│   └── admin/
│       └── AdminPages.jsx
├── hooks/
│   ├── useDiagnosis.js
│   ├── useAnalytics.js
│   ├── useAuth.js
│   └── useDebounce.js
├── services/
│   ├── api.js
│   ├── diagnosisAPI.js
│   └── analyticsAPI.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
└── contexts/
    ├── AuthContext.js
    └── ThemeContext.js
```

### 2. Component Design Principles

**Single Responsibility:** Each component has one clear purpose
**Composition:** Prefer composition over inheritance
**Reusability:** Create generic, configurable components
**Accessibility:** Follow ARIA guidelines and semantic HTML

## API Integration Patterns

### 1. API Service Layer

Create dedicated API service files for each domain:

```javascript
// services/diagnosisAPI.js
import api from "./api";

export const diagnosisAPI = {
  // Create new diagnosis
  createDiagnosis: async (patientData) => {
    const response = await api.post("/diagnosis/analyze-hcv/", patientData);
    return response.data;
  },

  // Get user's diagnoses
  getUserDiagnoses: async () => {
    const response = await api.get("/diagnosis/analyze-hcv/");
    return response.data;
  },

  // Get specific diagnosis
  getDiagnosis: async (id) => {
    const response = await api.get(`/diagnosis/analyze-hcv/${id}/`);
    return response.data;
  },

  // Update diagnosis metadata
  updateDiagnosis: async (id, data) => {
    const response = await api.put(`/diagnosis/analyze-hcv/${id}/`, data);
    return response.data;
  },

  // Delete diagnosis
  deleteDiagnosis: async (id) => {
    const response = await api.delete(`/diagnosis/analyze-hcv/${id}/`);
    return response.data;
  },

  // Search diagnoses
  searchDiagnoses: async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/diagnosis/search/?${params}`);
    return response.data;
  },

  // Get quick stats
  getQuickStats: async () => {
    const response = await api.get("/diagnosis/stats/");
    return response.data;
  },
};

// services/analyticsAPI.js
export const analyticsAPI = {
  // User analytics
  getUserAnalytics: async () => {
    const response = await api.get("/diagnosis/analytics/user/");
    return response.data;
  },

  // Admin analytics (staff only)
  getAdminAnalytics: async () => {
    const response = await api.get("/diagnosis/analytics/admin/");
    return response.data;
  },
};
```

### 2. Custom Hooks for Data Fetching

Use React Query or SWR for efficient data fetching:

```javascript
// hooks/useDiagnosis.js
import { useQuery, useMutation, useQueryClient } from "react-query";
import { diagnosisAPI } from "../services/diagnosisAPI";

export const useDiagnoses = () => {
  return useQuery("diagnoses", diagnosisAPI.getUserDiagnoses, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDiagnosis = (id) => {
  return useQuery(["diagnosis", id], () => diagnosisAPI.getDiagnosis(id), {
    enabled: !!id,
  });
};

export const useCreateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation(diagnosisAPI.createDiagnosis, {
    onSuccess: () => {
      queryClient.invalidateQueries("diagnoses");
      queryClient.invalidateQueries("user-analytics");
      queryClient.invalidateQueries("quick-stats");
    },
  });
};

export const useUpdateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation(({ id, data }) => diagnosisAPI.updateDiagnosis(id, data), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("diagnoses");
      queryClient.invalidateQueries(["diagnosis", variables.id]);
    },
  });
};

export const useDeleteDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation(diagnosisAPI.deleteDiagnosis, {
    onSuccess: () => {
      queryClient.invalidateQueries("diagnoses");
      queryClient.invalidateQueries("user-analytics");
    },
  });
};

export const useSearchDiagnoses = (filters) => {
  return useQuery(
    ["search-diagnoses", filters],
    () => diagnosisAPI.searchDiagnoses(filters),
    {
      enabled: Object.keys(filters).length > 0,
      keepPreviousData: true,
    }
  );
};

// hooks/useAnalytics.js
import { useQuery } from "react-query";
import { analyticsAPI } from "../services/analyticsAPI";

export const useUserAnalytics = () => {
  return useQuery("user-analytics", analyticsAPI.getUserAnalytics, {
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminAnalytics = () => {
  return useQuery("admin-analytics", analyticsAPI.getAdminAnalytics, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuickStats = () => {
  return useQuery("quick-stats", diagnosisAPI.getQuickStats, {
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};
```

## State Management

### 1. Context for Global State

```javascript
// contexts/DiagnosisContext.js
import React, { createContext, useContext, useReducer } from "react";

const DiagnosisContext = createContext();

const initialState = {
  selectedDiagnoses: [],
  filters: {},
  compareMode: false,
  viewMode: "list", // 'list', 'grid', 'table'
  sortBy: "created_at",
  sortOrder: "desc",
};

const diagnosisReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_DIAGNOSES":
      return { ...state, selectedDiagnoses: action.payload };
    case "ADD_SELECTED_DIAGNOSIS":
      return {
        ...state,
        selectedDiagnoses: [...state.selectedDiagnoses, action.payload],
      };
    case "REMOVE_SELECTED_DIAGNOSIS":
      return {
        ...state,
        selectedDiagnoses: state.selectedDiagnoses.filter(
          (id) => id !== action.payload
        ),
      };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "TOGGLE_COMPARE_MODE":
      return { ...state, compareMode: !state.compareMode };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.field,
        sortOrder: action.payload.order,
      };
    case "CLEAR_SELECTED":
      return { ...state, selectedDiagnoses: [] };
    default:
      return state;
  }
};

export const DiagnosisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState);

  return (
    <DiagnosisContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagnosisContext.Provider>
  );
};

export const useDiagnosisContext = () => {
  const context = useContext(DiagnosisContext);
  if (!context) {
    throw new Error(
      "useDiagnosisContext must be used within DiagnosisProvider"
    );
  }
  return context;
};
```

## UI Components & Pages

### 1. Diagnosis Form Component (note: have form for diagnisis , check that )

```jsx
// components/diagnosis/DiagnosisForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useCreateDiagnosis } from "../../hooks/useDiagnosis";

const schema = yup.object({
  patient_name: yup.string().required("Patient name is required"),
  age: yup
    .number()
    .required("Age is required")
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than 120"),
  sex: yup.string().required("Sex is required").oneOf(["male", "female"]),
  alp: yup.number().required("ALP value is required").min(0),
  ast: yup.number().required("AST value is required").min(0),
  che: yup.number().required("CHE value is required").min(0),
  crea: yup.number().required("CREA value is required").min(0),
  ggt: yup.number().required("GGT value is required").min(0),
});

const DiagnosisForm = ({ onSuccess, onError }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patient_name: "",
      age: "",
      sex: "",
      alp: "",
      ast: "",
      che: "",
      crea: "",
      ggt: "",
    },
  });

  const createDiagnosis = useCreateDiagnosis();

  const onSubmit = async (data) => {
    try {
      const result = await createDiagnosis.mutateAsync(data);
      onSuccess?.(result);
      reset();
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          New HCV Diagnosis
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="patient_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Patient Name"
                    error={!!errors.patient_name}
                    helperText={errors.patient_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Age"
                    type="number"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sex}>
                    <InputLabel>Sex</InputLabel>
                    <Select {...field} label="Sex">
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {errors.sex && (
                      <FormHelperText>{errors.sex.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Lab Values */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Laboratory Values
              </Typography>
            </Grid>

            {[
              { name: "alp", label: "ALP (Alkaline Phosphatase)", unit: "U/L" },
              {
                name: "ast",
                label: "AST (Aspartate Aminotransferase)",
                unit: "U/L",
              },
              { name: "che", label: "CHE (Cholinesterase)", unit: "kU/L" },
              { name: "crea", label: "CREA (Creatinine)", unit: "mg/dL" },
              {
                name: "ggt",
                label: "GGT (Gamma-Glutamyl Transferase)",
                unit: "U/L",
              },
            ].map((field) => (
              <Grid item xs={12} md={6} lg={4} key={field.name}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: fieldProps }) => (
                    <TextField
                      {...fieldProps}
                      fullWidth
                      label={`${field.label} (${field.unit})`}
                      type="number"
                      error={!!errors[field.name]}
                      helperText={errors[field.name]?.message}
                      inputProps={{ step: "0.01" }}
                    />
                  )}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                  disabled={createDiagnosis.isLoading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createDiagnosis.isLoading}
                  startIcon={
                    createDiagnosis.isLoading && <CircularProgress size={20} />
                  }
                >
                  {createDiagnosis.isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DiagnosisForm;
```

### 2. Diagnosis Result Modal (Note : i already have diagnosis result but i need to rework that , first check that )

```jsx
// components/diagnosis/DiagnosisResultModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Close,
  Person,
  Assessment,
  TrendingUp,
  Warning,
  CheckCircle,
} from "@mui/icons-material";

const DiagnosisResultModal = ({ open, onClose, diagnosis }) => {
  if (!diagnosis) return null;

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    return status?.toLowerCase() === "positive" ? "error" : "success";
  };

  const confidencePercentage = Math.round(
    (diagnosis.diagnosis_result?.confidence || 0) * 100
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment color="primary" />
          <Typography variant="h6">Diagnosis Results</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Patient Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Person color="primary" />
                  Patient Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>
                    <strong>Name:</strong> {diagnosis.patient_name}
                  </Typography>
                  <Typography>
                    <strong>Age:</strong> {diagnosis.age} years
                  </Typography>
                  <Typography>
                    <strong>Sex:</strong> {diagnosis.sex}
                  </Typography>
                  <Typography>
                    <strong>Analysis Date:</strong>{" "}
                    {new Date(diagnosis.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Lab Values */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Laboratory Values
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>
                    <strong>ALP:</strong> {diagnosis.ALP} U/L
                  </Typography>
                  <Typography>
                    <strong>AST:</strong> {diagnosis.AST} U/L
                  </Typography>
                  <Typography>
                    <strong>CHE:</strong> {diagnosis.CHE} kU/L
                  </Typography>
                  <Typography>
                    <strong>CREA:</strong> {diagnosis.CREA} mg/dL
                  </Typography>
                  <Typography>
                    <strong>GGT:</strong> {diagnosis.GGT} U/L
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Diagnosis Results */}
          <Grid item xs={12}>
            <Card
              variant="outlined"
              sx={{ border: 2, borderColor: "primary.main" }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TrendingUp color="primary" />
                  Diagnosis Results
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        HCV Status
                      </Typography>
                      <Chip
                        label={diagnosis.diagnosis_result?.hcv_status}
                        color={getStatusColor(
                          diagnosis.diagnosis_result?.hcv_status
                        )}
                        size="large"
                        sx={{ mt: 1, fontWeight: "bold" }}
                        icon={
                          diagnosis.diagnosis_result?.hcv_status?.toLowerCase() ===
                          "positive" ? (
                            <Warning />
                          ) : (
                            <CheckCircle />
                          )
                        }
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Risk Level
                      </Typography>
                      <Chip
                        label={diagnosis.diagnosis_result?.hcv_risk}
                        color={getRiskColor(
                          diagnosis.diagnosis_result?.hcv_risk
                        )}
                        size="large"
                        sx={{ mt: 1, fontWeight: "bold" }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Disease Stage
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ mt: 1, fontWeight: "bold" }}
                      >
                        {diagnosis.diagnosis_result?.hcv_stage}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Confidence Score */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Confidence Score: {confidencePercentage}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={confidencePercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                    color={
                      confidencePercentage >= 80
                        ? "success"
                        : confidencePercentage >= 60
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>

                {/* Stage Predictions */}
                {diagnosis.diagnosis_result?.stage_predictions && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Stage Predictions:
                    </Typography>
                    {Object.entries(
                      diagnosis.diagnosis_result.stage_predictions
                    ).map(([stage, probability]) => (
                      <Box key={stage} sx={{ mb: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2">{stage}</Typography>
                          <Typography variant="body2">
                            {Math.round(probability * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={probability * 100}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Recommendation */}
                {diagnosis.diagnosis_result?.recommendation && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Recommendation:
                    </Typography>
                    <Typography variant="body2">
                      {diagnosis.diagnosis_result.recommendation}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={() => {
            // TODO: Implement save/download functionality
            // i definately need this
            console.log("Save diagnosis:", diagnosis);
          }}
          variant="contained"
        >
          Save Results
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiagnosisResultModal;
```

### 3. Analytics Dashboard Component

```jsx
// components/analytics/AnalyticsDashboard.jsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Assessment, People, TrendingUp, Warning } from "@mui/icons-material";
import { useUserAnalytics } from "../../hooks/useAnalytics";
import StatCard from "./StatCard";
import TrendChart from "./TrendChart";
import PieChart from "./PieChart";

const AnalyticsDashboard = () => {
  const { data: analytics, isLoading, error } = useUserAnalytics();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load analytics data. Please try again.
      </Alert>
    );
  }

  const stats = analytics?.data;

  return (
    <Grid container spacing={3}>
      {/* Quick Stats */}
      <Grid item xs={12} md={3}>
        <StatCard
          title="Total Diagnoses"
          value={stats?.total_diagnoses || 0}
          icon={<Assessment />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Recent Activity"
          value={stats?.recent_diagnoses || 0}
          subtitle="Last 30 days"
          icon={<TrendingUp />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Positive Cases"
          value={stats?.hcv_status_distribution?.positive || 0}
          icon={<Warning />}
          color="error"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Avg. Confidence"
          value={`${stats?.average_confidence || 0}%`}
          icon={<Assessment />}
          color="info"
        />
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Trends
            </Typography>
            <TrendChart data={stats?.monthly_trends || []} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Distribution
            </Typography>
            <PieChart data={stats?.risk_distribution || {}} />
          </CardContent>
        </Card>
      </Grid>

      {/* Additional Charts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Age Distribution
            </Typography>
            <PieChart data={stats?.age_distribution || {}} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stage Distribution
            </Typography>
            <PieChart data={stats?.stage_distribution || {}} />
          </CardContent>
        </Card>
      </Grid>

      {/* Latest Diagnosis */}
      {stats?.latest_diagnosis && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest Diagnosis
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box>
                  <Typography variant="body1">
                    <strong>Patient:</strong>{" "}
                    {stats.latest_diagnosis.patient_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(
                      stats.latest_diagnosis.created_at
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ ml: "auto", textAlign: "right" }}>
                  <Typography variant="body1">
                    <strong>Status:</strong> {stats.latest_diagnosis.hcv_status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Risk:</strong> {stats.latest_diagnosis.hcv_risk}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default AnalyticsDashboard;
```

## Form Handling

### 1. Form Validation Utilities

```javascript
// utils/validators.js
import * as yup from "yup";

export const diagnosisFormSchema = yup.object({
  patient_name: yup
    .string()
    .required("Patient name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  age: yup
    .number()
    .required("Age is required")
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than 120")
    .integer("Age must be a whole number"),

  sex: yup
    .string()
    .required("Sex is required")
    .oneOf(["male", "female"], "Invalid sex selection"),

  alp: yup
    .number()
    .required("ALP value is required")
    .min(0, "ALP must be greater than or equal to 0")
    .max(1000, "ALP value seems too high"),

  ast: yup
    .number()
    .required("AST value is required")
    .min(0, "AST must be greater than or equal to 0")
    .max(1000, "AST value seems too high"),

  che: yup
    .number()
    .required("CHE value is required")
    .min(0, "CHE must be greater than or equal to 0")
    .max(50, "CHE value seems too high"),

  crea: yup
    .number()
    .required("CREA value is required")
    .min(0, "CREA must be greater than or equal to 0")
    .max(20, "CREA value seems too high"),

  ggt: yup
    .number()
    .required("GGT value is required")
    .min(0, "GGT must be greater than or equal to 0")
    .max(1000, "GGT value seems too high"),
});

export const searchFormSchema = yup.object({
  patient_name: yup.string().max(100),
  min_age: yup.number().min(0).max(120),
  max_age: yup.number().min(0).max(120),
  min_confidence: yup.number().min(0).max(1),
  max_confidence: yup.number().min(0).max(1),
  date_from: yup.date(),
  date_to: yup.date(),
});

// Cross-field validation
export const validateAgeRange = (values) => {
  const { min_age, max_age } = values;
  if (min_age && max_age && min_age > max_age) {
    return { max_age: "Maximum age must be greater than minimum age" };
  }
  return {};
};

export const validateConfidenceRange = (values) => {
  const { min_confidence, max_confidence } = values;
  if (min_confidence && max_confidence && min_confidence > max_confidence) {
    return {
      max_confidence:
        "Maximum confidence must be greater than minimum confidence",
    };
  }
  return {};
};
```

### 2. Advanced Form Component with Multi-step

```jsx
// components/diagnosis/DiagnosisFormStepper.jsx
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { diagnosisFormSchema } from "../../utils/validators";
import PatientInfoStep from "./steps/PatientInfoStep";
import LabValuesStep from "./steps/LabValuesStep";
import ReviewStep from "./steps/ReviewStep";

const steps = ["Patient Information", "Laboratory Values", "Review & Submit"];

const DiagnosisFormStepper = ({ onSubmit, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: yupResolver(diagnosisFormSchema),
    mode: "onChange",
    defaultValues: {
      patient_name: "",
      age: "",
      sex: "",
      alp: "",
      ast: "",
      che: "",
      crea: "",
      ggt: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid },
  } = methods;

  const handleNext = async () => {
    let fieldsToValidate = [];

    switch (activeStep) {
      case 0:
        fieldsToValidate = ["patient_name", "age", "sex"];
        break;
      case 1:
        fieldsToValidate = ["alp", "ast", "che", "crea", "ggt"];
        break;
      default:
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PatientInfoStep />;
      case 1:
        return <LabValuesStep />;
      case 2:
        return <ReviewStep />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          New HCV Diagnosis
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {getStepContent(index)}

                    <Box sx={{ mt: 2 }}>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>

                      {index === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={!isValid || isSubmitting}
                        >
                          {isSubmitting ? "Analyzing..." : "Submit Diagnosis"}
                        </Button>
                      ) : (
                        <Button variant="contained" onClick={handleNext}>
                          Continue
                        </Button>
                      )}

                      <Button onClick={onCancel} sx={{ ml: 1 }}>
                        Cancel
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default DiagnosisFormStepper;
```

## Data Visualization

### 1. Chart Components

```jsx
// components/analytics/TrendChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material/styles";

const TrendChart = ({ data, dataKey = "count", title }) => {
  const theme = useTheme();

  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
          activeDot={{
            r: 6,
            stroke: theme.palette.primary.main,
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
```

```jsx
// components/analytics/PieChart.jsx
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@mui/material/styles";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const PieChart = ({ data, title }) => {
  const theme = useTheme();

  const chartData = Object.entries(data).map(([key, value], index) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
```

## Error Handling

### 1. Error Boundary Component

```jsx
// components/common/ErrorBoundary.jsx
import React from "react";
import { Alert, AlertTitle, Button, Box, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              An unexpected error occurred. Please try refreshing the page.
            </Typography>

            <Button
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              variant="contained"
              size="small"
            >
              Refresh Page
            </Button>
          </Alert>

          {process.env.NODE_ENV === "development" && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="caption" component="pre">
                {this.state.error && this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 2. API Error Handler

```javascript
// utils/errorHandler.js
import { toast } from "react-toastify";

export const handleAPIError = (error, customMessage = null) => {
  let message = customMessage || "An unexpected error occurred";

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        message = data.message || "Invalid request data";
        break;
      case 401:
        message = "Please log in to continue";
        // Redirect to login
        window.location.href = "/login";
        return;
      case 403:
        message = "You do not have permission to perform this action";
        break;
      case 404:
        message = "The requested resource was not found";
        break;
      case 422:
        // Validation errors
        if (data.errors) {
          const validationErrors = Object.values(data.errors).flat();
          message = validationErrors.join(", ");
        }
        break;
      case 500:
        message = "Server error. Please try again later";
        break;
      default:
        message =
          data.message || `Error ${status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Network error
    message = "Network error. Please check your connection";
  }

  toast.error(message);
  return message;
};

export const handleValidationErrors = (errors, setError) => {
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field, {
      type: "server",
      message: Array.isArray(messages) ? messages[0] : messages,
    });
  });
};
```

## Performance Optimization

### 1. Memoization and Optimization

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from "react";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// hooks/useOptimisticUpdate.js
import { useMutation, useQueryClient } from "react-query";

export const useOptimisticUpdate = (mutationFn, queryKey, updateFn) => {
  const queryClient = useQueryClient();

  return useMutation(mutationFn, {
    onMutate: async (newData) => {
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => updateFn(old, newData));

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(queryKey, context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};
```

### 2. Lazy Loading and Code Splitting

```jsx
// components/LazyWrapper.jsx
import React, { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

const LazyWrapper = ({ children, fallback = null }) => {
  const defaultFallback = (
    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
      <CircularProgress />
    </Box>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};

export default LazyWrapper;

// App.jsx - Lazy loading pages
import { lazy } from "react";

const DiagnosisPage = lazy(() => import("./pages/DiagnosisPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
```

## Best Practices

### 1. Code Organization

- Use TypeScript for better type safety
- Implement proper error boundaries
- Use React.memo for expensive components
- Implement proper loading states
- Use proper semantic HTML and ARIA labels

### 2. API Integration

- Always handle loading and error states
- Implement proper caching strategies
- Use optimistic updates for better UX
- Implement proper retry logic
- Add request/response interceptors for common tasks

### 3. Performance

- Implement virtual scrolling for large lists
- Use React Query for efficient data fetching
- Implement proper pagination
- Use debouncing for search inputs
- Optimize bundle size with code splitting

### 4. User Experience

- Provide clear feedback for all actions
- Implement proper form validation
- Use progressive disclosure for complex forms
- Implement keyboard navigation
- Provide proper loading indicators

### 5. Testing Strategy

- Unit tests for utility functions
- Integration tests for API calls
- Component tests with React Testing Library
- E2E tests for critical user flows
- Visual regression tests for UI components

---

This implementation guide provides a comprehensive foundation for building a robust, scalable, and user-friendly frontend for the HepatoCAI diagnosis system. The patterns and components suggested here follow React best practices and provide excellent user experience while maintaining code quality and performance.
