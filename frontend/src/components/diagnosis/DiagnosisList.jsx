import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import DiagnosisCard from "./DiagnosisCard";

const DiagnosisList = ({
  searchResults = null,
  isLoading = false,
  isError = false,
  error = null,
  showTitle = true,
  pagination = null,
  onPageChange = null,
  onPageSizeChange = null,
  currentPage = 1,
  pageSize = 4,
}) => {
  // Internal pagination state for backward compatibility
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // console.log("DiagnosisList searchResults:", searchResults);

  const diagnoses =
    searchResults?.data?.results || searchResults?.results || [];

  // Use external pagination if provided, otherwise calculate locally
  const useExternalPagination = pagination && onPageChange && onPageSizeChange;

  if (useExternalPagination) {
    // External pagination - use provided data
    const totalPages =
      pagination.total_pages || Math.ceil(pagination.total_count / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(
      currentPage * pageSize,
      pagination.total_count || diagnoses.length
    );

    const handlePageChange = (event, newPage) => {
      onPageChange(event, newPage);
    };

    const handlePageSizeChange = (event) => {
      onPageSizeChange(event);
    };

    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress size={48} />
        </Box>
      );
    }

    if (isError) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading diagnoses: {error?.message || "Unknown error"}
        </Alert>
      );
    }

    if (!diagnoses || diagnoses.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No diagnoses found. Try adjusting your search criteria.
        </Alert>
      );
    }

    return (
      <Box>
        {showTitle && (
          <Typography variant="h6" component="h2" gutterBottom>
            Search Results ({pagination.total_count || diagnoses.length} found)
          </Typography>
        )}

        {/* Items per page selector */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Items per page</InputLabel>
            <Select
              value={pageSize}
              label="Items per page"
              onChange={handlePageSizeChange}
            >
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={16}>16</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary">
            Showing {startIndex}-{endIndex} of{" "}
            {pagination.count || diagnoses.length}
          </Typography>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          sx={{
            "& > *": {
              flex: "1 1 300px",
              maxWidth: "400px",
            },
          }}
        >
          {diagnoses.map((diagnosis, index) => (
            <DiagnosisCard key={diagnosis.id || index} diagnosis={diagnosis} />
          ))}
        </Box>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    );
  }

  // Fallback to internal pagination for backward compatibility
  // Calculate pagination
  const totalPages = Math.ceil(diagnoses.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDiagnoses = diagnoses.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to first page when changing items per page
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading diagnoses: {error?.message || "Unknown error"}
      </Alert>
    );
  }

  if (!diagnoses || diagnoses.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No diagnoses found. Try adjusting your search criteria.
      </Alert>
    );
  }

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" component="h2" gutterBottom>
          Search Results ({diagnoses.length} found)
        </Typography>
      )}
      {/* Items per page selector */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>{" "}
          <Select
            value={itemsPerPage}
            label="Items per page"
            onChange={handleItemsPerPageChange}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={16}>16</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          Showing {startIndex + 1}-{Math.min(endIndex, diagnoses.length)} of{" "}
          {diagnoses.length}
        </Typography>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        sx={{
          "& > *": {
            flex: "1 1 300px",
            maxWidth: "400px",
          },
        }}
      >
        {paginatedDiagnoses.map((diagnosis, index) => (
          <DiagnosisCard key={diagnosis.id || index} diagnosis={diagnosis} />
        ))}
      </Box>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

DiagnosisList.propTypes = {
  searchResults: PropTypes.object,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  showTitle: PropTypes.bool,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
};

export default DiagnosisList;
