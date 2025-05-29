import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
} from "@mui/material";
import {
  Search,
  MoreVert,
  PersonAdd,
  Refresh,
  Download,
  People,
  Security,
  AdminPanelSettings,
  Block,
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import api from "../../api";
import AdminNavbar from "../../components/admin/AdminNavbar";

function UserManagement() {
  console.log("UserManagement component rendered");
  const { user: currentUser } = useAuth();
  console.log("UserManagement currentUser:", currentUser);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const fetchUsers = useCallback(async () => {
    console.log("UserManagement: Starting fetchUsers");
    console.log("UserManagement: currentUser:", currentUser);
    setLoading(true);
    try {
      const endpoint = currentUser?.is_superuser
        ? "/users/admin/users/"
        : "/users/staff/users/";
      console.log("UserManagement: Using endpoint:", endpoint);
      const response = await api.get(endpoint);
      console.log("UserManagement: API response:", response);

      if (response.data.status === "success") {
        setUsers(response.data.data);
        setPermissions(response.data.permissions || {});
        console.log(
          "UserManagement: Users loaded successfully:",
          response.data.data.length,
          "users"
        );
      }
    } catch (error) {
      console.error("UserManagement: Error fetching users:", error);
      setMessage("Error fetching user data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const filterUsers = useCallback(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole =
        filterRole === "all" ||
        (filterRole === "superuser" && user.is_superuser) ||
        (filterRole === "staff" && user.is_staff && !user.is_superuser) ||
        (filterRole === "user" && !user.is_staff);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && user.is_active) ||
        (filterStatus === "inactive" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
    setFilteredUsers(filtered);
    setPage(1);
  }, [users, searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleUserPermissionChange = async (userId, field, value) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const confirmTitle = `${value ? "Promote" : "Demote"} User`;
    let confirmMessage = "";

    if (field === "is_staff") {
      confirmMessage = `Are you sure you want to ${
        value ? "promote" : "demote"
      } ${targetUser.full_name || targetUser.email} ${
        value ? "to" : "from"
      } staff status?`;
    } else if (field === "is_superuser") {
      confirmMessage = `Are you sure you want to ${
        value ? "promote" : "demote"
      } ${targetUser.full_name || targetUser.email} ${
        value ? "to" : "from"
      } superuser status?`;
    } else if (field === "is_active") {
      confirmMessage = `Are you sure you want to ${
        value ? "activate" : "deactivate"
      } ${targetUser.full_name || targetUser.email}?`;
    }

    setConfirmDialog({
      open: true,
      title: confirmTitle,
      message: confirmMessage,
      action: () => confirmUserPermissionChange(userId, field, value),
    });
  };

  const confirmUserPermissionChange = async (userId, field, value) => {
    try {
      const endpoint = currentUser?.is_superuser
        ? `/users/admin/users/${userId}/`
        : `/users/staff/users/${userId}/`;

      const response = await api.patch(endpoint, { [field]: value });

      if (response.data.status === "success") {
        setMessage(`User permissions updated successfully`);
        setMessageType("success");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user permissions:", error);
      const errorMsg =
        error.response?.data?.error || "Error updating user permissions";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setConfirmDialog({ open: false, title: "", message: "", action: null });
      setActionMenuAnchor(null);
    }
  };

  const handleActionMenuOpen = (event, user) => {
    setSelectedUser(user);
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const exportUsers = async () => {
    try {
      const response = await api.get("/users/admin/users/export/", {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users_export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("Users exported successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error exporting users:", error);
      setMessage("Error exporting users");
      setMessageType("error");
    }
  };

  const getUserRoleChip = (user) => {
    if (user.is_superuser) {
      return (
        <Chip label="Superuser" color="error" size="small" variant="filled" />
      );
    }
    if (user.is_staff) {
      return (
        <Chip label="Staff" color="warning" size="small" variant="filled" />
      );
    }
    return (
      <Chip label="User" color="default" size="small" variant="outlined" />
    );
  };

  const getStatusChip = (user) => {
    return (
      <Chip
        label={user.is_active ? "Active" : "Inactive"}
        color={user.is_active ? "success" : "error"}
        size="small"
        variant={user.is_active ? "filled" : "outlined"}
        icon={user.is_active ? <CheckCircle /> : <Block />}
      />
    );
  };

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <AdminNavbar />
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <People sx={{ fontSize: "inherit", mr: 1, color: "primary.main" }} />
          User Management
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Manage system users, roles, and permissions
        </Typography>
      </Box>

      {/* Messages */}
      {message && (
        <Alert
          severity={messageType}
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Controls */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filterRole}
                  label="Role"
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="superuser">Superuser</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={exportUsers}
                >
                  Export
                </Button>
                {permissions.can_promote_to_staff && (
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => {
                      /* Add user functionality */
                    }}
                  >
                    Add User
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Joined</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Last Login
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          bgcolor:
                            user.id === currentUser?.id
                              ? "primary.50"
                              : "inherit",
                          borderLeft:
                            user.id === currentUser?.id ? "4px solid" : "none",
                          borderLeftColor: "primary.main",
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={user.profile_picture}
                              sx={{ width: 40, height: 40 }}
                            >
                              {(user.full_name || user.username || user.email)
                                .charAt(0)
                                .toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {user.full_name ||
                                  `${user.first_name} ${user.last_name}`.trim() ||
                                  user.username}
                                {user.id === currentUser?.id && (
                                  <Chip
                                    label="You"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                      ml: 1,
                                      fontSize: "0.7rem",
                                      height: 20,
                                    }}
                                  />
                                )}
                              </Typography>
                              {user.is_social_user && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {user.social_provider} Login
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                        </TableCell>
                        <TableCell>{getUserRoleChip(user)}</TableCell>
                        <TableCell>{getStatusChip(user)}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(user.date_joined).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.last_login
                              ? new Date(user.last_login).toLocaleDateString()
                              : "Never"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleActionMenuOpen(e, user)}
                            disabled={user.id === currentUser?.id}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {filteredUsers.length > rowsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Pagination
                    count={Math.ceil(filteredUsers.length / rowsPerPage)}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                    color="primary"
                  />
                </Box>
              )}

              {/* No users found */}
              {filteredUsers.length === 0 && !loading && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <People sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No users found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {searchTerm
                      ? "Try adjusting your search filters"
                      : "No users in the system"}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        {selectedUser && (
          <>
            <MenuItem
              onClick={() => {
                handleUserPermissionChange(
                  selectedUser.id,
                  "is_active",
                  !selectedUser.is_active
                );
              }}
              disabled={!permissions.can_deactivate_users}
            >
              {selectedUser.is_active ? (
                <Block sx={{ mr: 1 }} />
              ) : (
                <CheckCircle sx={{ mr: 1 }} />
              )}
              {selectedUser.is_active ? "Deactivate" : "Activate"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleUserPermissionChange(
                  selectedUser.id,
                  "is_staff",
                  !selectedUser.is_staff
                );
              }}
              disabled={!permissions.can_promote_to_staff}
            >
              <Security sx={{ mr: 1 }} />
              {selectedUser.is_staff ? "Remove Staff" : "Make Staff"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleUserPermissionChange(
                  selectedUser.id,
                  "is_superuser",
                  !selectedUser.is_superuser
                );
              }}
              disabled={!permissions.can_promote_to_superuser}
            >
              <AdminPanelSettings sx={{ mr: 1 }} />
              {selectedUser.is_superuser
                ? "Remove Superuser"
                : "Make Superuser"}
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            action: null,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                title: "",
                message: "",
                action: null,
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
