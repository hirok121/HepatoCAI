import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Avatar,
  Alert,
  Chip,
  Container,
  Grid,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import {
  Person as UserIcon,
  Email as MailIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as CameraIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useProfile, useProfileUpdate } from "../hooks/useProfile";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import NavBar from "../components/layout/NavBar";

const ProfilePage = () => {
  const { profile, loading, error, refetch } = useProfile();
  const {
    updateProfile,
    updateProfilePicture,
    updating,
    updateError,
    updateSuccess,
    clearMessages,
  } = useProfileUpdate();
  console.log("ProfilePage profile:", profile);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    first_name: "",
    last_name: "",
    birthday: "",
  });
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    if (profile?.data) {
      setFormData({
        full_name: profile.data.full_name || "",
        first_name: profile.data.first_name || "",
        last_name: profile.data.last_name || "",
        birthday: profile.data.birthday || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      setShowSuccess(true);
    }
  }, [updateSuccess]);

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;

    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Try to parse and format to YYYY-MM-DD
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    } catch {
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (formData.birthday && !isValidDate(formData.birthday)) {
      errors.birthday = "Please enter a valid date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      // Prepare the data, ensuring birthday is properly formatted or null
      const submitData = {
        ...formData,
        birthday: formatDateForAPI(formData.birthday),
      };

      console.log("Sending form data:", submitData);
      await updateProfile(submitData);
      setIsEditing(false);
      refetch(); // Refresh profile data
    } catch (err) {
      console.error("Update failed:", err);
      console.error("Form data that failed:", formData);
    }
  };
  const handleCancel = () => {
    // Reset form to original data
    setFormData({
      full_name: profile.data.full_name || "",
      first_name: profile.data.first_name || "",
      last_name: profile.data.last_name || "",
      birthday: profile.data.birthday || "",
    });
    setFormErrors({});
    setIsEditing(false);
    clearMessages();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setFormErrors((prev) => ({
          ...prev,
          profile_picture: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          profile_picture: "File size must be less than 5MB",
        }));
        return;
      }

      try {
        await updateProfilePicture(file);
        refetch(); // Refresh profile data
      } catch (err) {
        console.error("Profile picture update failed:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getInitials = (profile) => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.full_name) {
      const names = profile.full_name.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return profile?.username?.[0]?.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <LoadingIndicator />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load profile: {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            My Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your personal information and account settings
          </Typography>
        </Box>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Profile updated successfully!
          </Alert>
        </Snackbar>

        {/* Error Alert */}
        {updateError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearMessages}>
            {updateError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Header Card */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  {/* Avatar Section */}
                  <Grid item xs={12} sm="auto">
                    <Box position="relative" display="inline-block">
                      {" "}
                      <Avatar
                        src={profile?.data?.profile_picture}
                        alt={
                          profile?.data?.full_name || profile?.data?.username
                        }
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: "2rem",
                          bgcolor: "primary.main",
                        }}
                      >
                        {getInitials(profile?.data)}
                      </Avatar>
                      <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleProfilePictureChange}
                        disabled={updating}
                      />
                      <IconButton
                        component="label"
                        htmlFor="profile-picture-input"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                          width: 40,
                          height: 40,
                        }}
                        disabled={updating}
                      >
                        <CameraIcon />
                      </IconButton>
                    </Box>

                    {formErrors.profile_picture && (
                      <Alert severity="error" sx={{ mt: 2, maxWidth: 300 }}>
                        {formErrors.profile_picture}
                      </Alert>
                    )}
                  </Grid>

                  {/* Profile Info */}
                  <Grid item xs={12} sm>
                    {" "}
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {profile?.data?.full_name ||
                        `${profile?.data?.first_name || ""} ${
                          profile?.data?.last_name || ""
                        }`.trim() ||
                        profile?.data?.username}
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <MailIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body1" color="text.secondary">
                        {profile?.data?.email}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {profile?.data?.verified_email && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Verified Email"
                          color="success"
                          size="small"
                        />
                      )}
                      {profile?.data?.is_social_user && (
                        <Chip
                          label={`${profile?.data?.social_provider} Account`}
                          color="info"
                          size="small"
                        />
                      )}
                    </Box>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} sm="auto">
                    <Box
                      display="flex"
                      gap={2}
                      flexDirection={{ xs: "column", sm: "row" }}
                    >
                      {!isEditing ? (
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditing(true)}
                          sx={{ minWidth: 120 }}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={handleCancel}
                            sx={{ minWidth: 100 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={
                              updating ? (
                                <CircularProgress size={16} />
                              ) : (
                                <SaveIcon />
                              )
                            }
                            onClick={handleSubmit}
                            disabled={updating}
                            sx={{ minWidth: 120 }}
                          >
                            {updating ? "Saving..." : "Save Changes"}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information Card */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center">
                    <UserIcon sx={{ mr: 2, color: "primary.main" }} />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                }
              />
              <CardContent>
                {isEditing ? (
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          error={!!formErrors.first_name}
                          helperText={formErrors.first_name}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          error={!!formErrors.last_name}
                          helperText={formErrors.last_name}
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Birthday"
                          name="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={handleInputChange}
                          error={!!formErrors.birthday}
                          helperText={formErrors.birthday}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {" "}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        First Name
                      </Typography>
                      <Typography variant="body1">
                        {profile?.data?.first_name || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Last Name
                      </Typography>
                      <Typography variant="body1">
                        {profile?.data?.last_name || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {profile?.data?.full_name || "Not provided"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center">
                        <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Birthday
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(profile?.data?.birthday)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Information Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6">Account Information</Typography>
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  {" "}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Username
                    </Typography>
                    <Typography variant="body1">
                      {profile?.data?.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Email
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">
                        {profile?.data?.email}
                      </Typography>
                      {profile?.data?.verified_email && (
                        <CheckCircleIcon
                          sx={{ ml: 1, color: "success.main", fontSize: 20 }}
                        />
                      )}
                    </Box>
                  </Grid>
                  {profile?.data?.locale && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Locale
                      </Typography>
                      <Typography variant="body1">
                        {profile.data.locale}
                      </Typography>
                    </Grid>
                  )}
                  {profile?.data?.social_provider && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Connected Account
                      </Typography>
                      <Typography variant="body1">
                        {profile.data.social_provider}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>{" "}
    </Box>
  );
};

export default ProfilePage;
