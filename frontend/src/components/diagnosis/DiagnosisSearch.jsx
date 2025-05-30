import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { useDebounce } from "../../hooks/useDebounce";

const DiagnosisSearch = ({
  onSearch,
  onFiltersChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState({
    patient_name: "",
    hcv_status: "",
    hcv_risk: "",
    ...initialFilters,
  });

  // Debounce the search term
  const debouncedPatientName = useDebounce(filters.patient_name, 300);

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, patient_name: debouncedPatientName }));
  }, [debouncedPatientName]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      patient_name: "",
      hcv_status: "",
      hcv_risk: "",
    };
    setFilters(clearedFilters);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
        {/* Patient Name Search */}
        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <TextField
            fullWidth
            label="Search Patient Name"
            variant="outlined"
            value={filters.patient_name}
            onChange={(e) => handleFilterChange("patient_name", e.target.value)}
            placeholder="Enter patient name..."
          />
        </Box>

        {/* HCV Status Filter */}
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>HCV Status</InputLabel>
            <Select
              value={filters.hcv_status}
              label="HCV Status"
              onChange={(e) => handleFilterChange("hcv_status", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Positive">Positive</MenuItem>
              <MenuItem value="Negative">Negative</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Risk Level Filter */}
        <Box sx={{ minWidth: 150 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={filters.hcv_risk}
              label="Risk Level"
              onChange={(e) => handleFilterChange("hcv_risk", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

DiagnosisSearch.propTypes = {
  onSearch: PropTypes.func,
  onFiltersChange: PropTypes.func,
  initialFilters: PropTypes.object,
};

export default DiagnosisSearch;
