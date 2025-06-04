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
import DebugFieldButton from "../debug/DebugFieldButton";
import DebugSectionButton from "../debug/DebugSectionButton";
import { FEATURES } from "../../config/constants";

// Random value generators for patient info
const randomValueGenerators = {
  patientName: () => {
    const firstNames = [
      "John",
      "Jane",
      "Michael",
      "Sarah",
      "David",
      "Lisa",
      "James",
      "Emily",
      "Robert",
      "Jessica",
      "William",
      "Ashley",
      "Christopher",
      "Amanda",
      "Daniel",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
    ];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  },
  age: () => Math.floor(Math.random() * 60) + 18, // 18-98 years
  sex: () => (Math.random() > 0.5 ? "Male" : "Female"),
};

function PatientInfoStep({ formData, handleChange }) {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Person sx={{ color: "#2563EB", mr: 2, fontSize: "2rem" }} />
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#1E293B" }}>
          Patient Information
        </Typography>
        {FEATURES.ENABLE_DIAGNOSIS_DEBUG && (
          <DebugSectionButton
            sectionName="Patient Info"
            fields={["patientName", "age", "sex"]}
            handleChange={handleChange}
            formData={formData}
            randomValueGenerators={randomValueGenerators}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <DebugFieldButton
            fieldName="patientName"
            handleChange={handleChange}
            formData={formData}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              minWidth: 200,
            }}
          >
            <TextField
              fullWidth
              label="Age *"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <DebugFieldButton
              fieldName="age"
              handleChange={handleChange}
              formData={formData}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              minWidth: 200,
            }}
          >
            <FormControl fullWidth required>
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
            <DebugFieldButton
              fieldName="sex"
              handleChange={handleChange}
              formData={formData}
            />
          </Box>
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
