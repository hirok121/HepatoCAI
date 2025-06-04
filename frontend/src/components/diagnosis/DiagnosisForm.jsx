import React from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Psychology, Send } from "@mui/icons-material";
import { useCreateDiagnosis } from "../../hooks/useDiagnosis";

const DiagnosisForm = ({ onSuccess, onCancel }) => {
  const createDiagnosisMutation = useCreateDiagnosis();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      patient_name: "",
      age: "",
      sex: "",
      alp: "",
      ast: "",
      che: "",
      crea: "",
      cgt: "",
    },
  });

  const watchedValues = watch();

  const validationRules = {
    patient_name: {
      required: "Patient name is required",
      minLength: {
        value: 2,
        message: "Patient name must be at least 2 characters",
      },
    },
    age: {
      required: "Age is required",
      min: {
        value: 1,
        message: "Age must be at least 1",
      },
      max: {
        value: 120,
        message: "Age must be less than 120",
      },
    },
    sex: {
      required: "Sex is required",
    },
    alp: {
      required: "ALP value is required",
      min: {
        value: 0,
        message: "ALP value must be positive",
      },
    },
    ast: {
      required: "AST value is required",
      min: {
        value: 0,
        message: "AST value must be positive",
      },
    },
    che: {
      required: "CHE value is required",
      min: {
        value: 0,
        message: "CHE value must be positive",
      },
    },
    crea: {
      required: "CREA value is required",
      min: {
        value: 0,
        message: "CREA value must be positive",
      },
    },
    cgt: {
      required: "CGT value is required",
      min: {
        value: 0,
        message: "CGT value must be positive",
      },
    },
  };

  const onSubmit = async (data) => {
    try {
      const result = await createDiagnosisMutation.mutateAsync({
        ...data,
        age: parseInt(data.age),
        alp: parseFloat(data.alp),
        ast: parseFloat(data.ast),
        che: parseFloat(data.che),
        crea: parseFloat(data.crea),
        cgt: parseFloat(data.cgt),
      });

      if (onSuccess) {
        onSuccess(result);
      }
      reset();
    } catch (error) {
      console.error("Error creating diagnosis:", error);
    }
  };

  const handleReset = () => {
    reset();
  };

  const isFormValid = () => {
    return Object.values(watchedValues).every((value) => value !== "");
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Psychology sx={{ fontSize: "2rem", color: "primary.main", mr: 2 }} />
          <Typography variant="h5" component="h2">
            New HCV Diagnosis
          </Typography>
        </Box>

        {createDiagnosisMutation.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {createDiagnosisMutation.error?.response?.data?.message ||
              "An error occurred while creating the diagnosis. Please try again."}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Patient Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Patient Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="patient_name"
                control={control}
                rules={validationRules.patient_name}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Patient Name"
                    error={!!errors.patient_name}
                    helperText={errors.patient_name?.message}
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="age"
                control={control}
                rules={validationRules.age}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Age"
                    type="number"
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="sex"
                control={control}
                rules={validationRules.sex}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sex}>
                    <InputLabel>Sex</InputLabel>
                    <Select
                      {...field}
                      label="Sex"
                      disabled={createDiagnosisMutation.isLoading}
                    >
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

            {/* Laboratory Values */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Laboratory Values
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} lg={2.4}>
              <Controller
                name="alp"
                control={control}
                rules={validationRules.alp}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ALP (U/L)"
                    type="number"
                    step="0.1"
                    error={!!errors.alp}
                    helperText={errors.alp?.message || "Alkaline Phosphatase"}
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={2.4}>
              <Controller
                name="ast"
                control={control}
                rules={validationRules.ast}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="AST (U/L)"
                    type="number"
                    step="0.1"
                    error={!!errors.ast}
                    helperText={
                      errors.ast?.message || "Aspartate Aminotransferase"
                    }
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={2.4}>
              <Controller
                name="che"
                control={control}
                rules={validationRules.che}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CHE (U/L)"
                    type="number"
                    step="0.1"
                    error={!!errors.che}
                    helperText={errors.che?.message || "Cholinesterase"}
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={2.4}>
              <Controller
                name="crea"
                control={control}
                rules={validationRules.crea}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CREA (mg/dL)"
                    type="number"
                    step="0.1"
                    error={!!errors.crea}
                    helperText={errors.crea?.message || "Creatinine"}
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={2.4}>
              <Controller
                name="cgt"
                control={control}
                rules={validationRules.cgt}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CGT (U/L)"
                    type="number"
                    step="0.1"
                    error={!!errors.cgt}
                    helperText={
                      errors.cgt?.message || "Gamma-Glutamyl Transferase"
                    }
                    disabled={createDiagnosisMutation.isLoading}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Box display="flex" gap={2} width="100%">
          <Button
            variant="contained"
            startIcon={
              createDiagnosisMutation.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Send />
              )
            }
            onClick={handleSubmit(onSubmit)}
            disabled={createDiagnosisMutation.isLoading || !isFormValid()}
            size="large"
          >
            {createDiagnosisMutation.isLoading ? "Analyzing..." : "Analyze"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={createDiagnosisMutation.isLoading}
          >
            Reset
          </Button>

          {onCancel && (
            <Button
              variant="text"
              onClick={onCancel}
              disabled={createDiagnosisMutation.isLoading}
            >
              Cancel
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

DiagnosisForm.propTypes = {
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DiagnosisForm;
