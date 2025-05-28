// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Person } from "@mui/icons-material";

function PatientInfoStep({ formData, handleChange }) {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Person sx={{ color: "#2563EB", mr: 2, fontSize: "2rem" }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1E293B" }}>
          Patient Information
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          fullWidth
          label="Patient Name *"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Age *"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            sx={{
              flex: 1,
              minWidth: 200,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <FormControl sx={{ flex: 1, minWidth: 200 }} required>
            <InputLabel>Sex *</InputLabel>
            <Select
              value={formData.sex}
              name="sex"
              onChange={handleChange}
              label="Sex"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

// PropTypes for validation
PatientInfoStep.propTypes = {
  formData: PropTypes.shape({
    patientName: PropTypes.string.isRequired,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sex: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PatientInfoStep;
