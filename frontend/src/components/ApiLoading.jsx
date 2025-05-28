import { Box, CircularProgress, Typography } from "@mui/material";

// App-Level Loader Component
const AppLoader = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <CircularProgress size={60} />
    <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
      Loading HepatoCAI...
    </Typography>
  </Box>
);

export default AppLoader;
