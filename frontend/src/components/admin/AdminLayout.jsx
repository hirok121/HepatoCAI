import { Box, Container, Paper } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  const { user, loading } = useAuth();

  console.log("AdminLayout - user:", user);
  console.log("AdminLayout - loading:", loading);
  console.log("AdminLayout - is_staff:", user?.is_staff);
  console.log("AdminLayout - is_superuser:", user?.is_superuser);

  if (loading) {
    console.log("AdminLayout - showing loading screen");
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </Box>
    );
  }

  // Check if user has admin privileges
  if (!user || (!user.is_staff && !user.is_superuser)) {
    console.log("AdminLayout - redirecting to home, no admin privileges");
    return <Navigate to="/" replace />;
  }

  console.log("AdminLayout - rendering admin interface");
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper
          elevation={1}
          sx={{
            minHeight: "calc(100vh - 120px)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminLayout;
