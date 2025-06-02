import { useState, useEffect } from "react";
import {
  Box,
  Card,
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
  Cancel as CancelIcon,
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
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    phone_number: "",
    country: "",
    city: "",
    timezone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    if (profile?.data) {
      setFormData({
        first_name: profile.data.first_name || "",
        last_name: profile.data.last_name || "",
        birthday: profile.data.birthday || "",
        phone_number: profile.data.phone_number || "",
        country: profile.data.country || "",
        city: profile.data.city || "",
        timezone: profile.data.timezone || "",
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
      first_name: profile.data.first_name || "",
      last_name: profile.data.last_name || "",
      birthday: profile.data.birthday || "",
      phone_number: profile.data.phone_number || "",
      country: profile.data.country || "",
      city: profile.data.city || "",
      timezone: profile.data.timezone || "",
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
    if (profile?.username) {
      return profile.username[0].toUpperCase();
    }
    if (profile?.display_name) {
      return profile.display_name[0].toUpperCase();
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return "U";
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "300px",
          background: "linear-gradient(135deg, #2563EB 0%, #1e3a8a 100%)",
          zIndex: 0,
        },
      }}
    >
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, position: "relative", zIndex: 1 }}>
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
          <Alert
            severity="error"
            sx={{
              mb: 3,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
            onClose={clearMessages}
          >
            {updateError}
          </Alert>
        )}

        {/* Profile Header Card */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #2563EB, #4F46E5)",
            },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Avatar Section */}
            <Grid item xs={12} md={3}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={profile?.data?.profile_picture}
                    alt={profile?.data?.username}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: "2rem",
                      background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                      border: "4px solid rgba(255,255,255,0.8)",
                      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
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
                      bgcolor: "#2563EB",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#1d4ed8",
                        transform: "scale(1.1)",
                      },
                      width: 40,
                      height: 40,
                      transition: "all 0.3s ease",
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
              </Box>
            </Grid>

            {/* Profile Info */}
            <Grid item xs={12} md={6}>
              <Box>
                {" "}
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #2563EB, #1e3a8a)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {`${profile?.data?.first_name || ""} ${
                    profile?.data?.last_name || ""
                  }`.trim() ||
                    profile?.data?.display_name ||
                    profile?.data?.username ||
                    "User"}
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
                      sx={{
                        background: "linear-gradient(135deg, #10b981, #34d399)",
                        color: "white",
                        "& .MuiChip-icon": { color: "white" },
                      }}
                      size="small"
                    />
                  )}
                  {profile?.data?.is_social_user && (
                    <Chip
                      label={`${profile?.data?.social_provider} Account`}
                      sx={{
                        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        color: "white",
                      }}
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} md={3}>
              <Box display="flex" flexDirection="column" gap={2}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CloseIcon />}
                      onClick={handleCancel}
                      sx={{
                        borderColor: "#e5e7eb",
                        color: "#6b7280",
                        "&:hover": {
                          borderColor: "#d1d5db",
                          backgroundColor: "rgba(229, 231, 235, 0.1)",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={
                        updating ? <CircularProgress size={16} /> : <SaveIcon />
                      }
                      onClick={handleSubmit}
                      disabled={updating}
                      sx={{
                        background: "linear-gradient(135deg, #10b981, #34d399)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #059669, #10b981)",
                        },
                      }}
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={4}>
          {/* Personal Information Card */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                "&:hover": {
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Box display="flex" alignItems="center">
                  <UserIcon
                    sx={{ mr: 2, color: "#2563EB", fontSize: "1.5rem" }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#1e293b" }}
                  >
                    Personal Information
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 4 }}>
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          error={!!formErrors.phone_number}
                          helperText={formErrors.phone_number}
                          placeholder="+1234567890"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          error={!!formErrors.country}
                          helperText={formErrors.country}
                          placeholder="United States"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          error={!!formErrors.city}
                          helperText={formErrors.city}
                          placeholder="New York"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Timezone"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          error={!!formErrors.timezone}
                          helperText={formErrors.timezone}
                          placeholder="America/New_York"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563EB",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2563EB",
                                },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2563EB",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          First Name
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile?.data?.first_name || "Not provided"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2563EB",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Last Name
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile?.data?.last_name || "Not provided"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CalendarIcon sx={{ mr: 2, color: "#2563EB" }} />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "#2563EB",
                              fontWeight: 600,
                              mb: 1,
                              fontSize: "0.85rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Birthday
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {formatDate(profile?.data?.birthday)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {" "}
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2563EB",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Phone Number
                        </Typography>{" "}
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {profile?.data?.phone_number || "Not provided"}
                          </Typography>
                          {profile?.data?.phone_number &&
                            (profile?.data?.phone_verified_at ? (
                              <CheckCircleIcon
                                sx={{ color: "#10b981", fontSize: 20 }}
                              />
                            ) : (
                              <CancelIcon
                                sx={{ color: "#ef4444", fontSize: 20 }}
                              />
                            ))}
                        </Box>{" "}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2563EB",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Country
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile?.data?.country || "Not provided"}
                        </Typography>
                      </Box>
                    </Grid>{" "}
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2563EB",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          City
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile?.data?.city || "Not provided"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(79, 70, 229, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#2563EB",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Timezone
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile?.data?.timezone || "Not provided"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Account Information Card */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                "&:hover": {
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                },
                transition: "all 0.3s ease",
                height: "fit-content",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  Account Information
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 3,
                        background:
                          "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.02) 100%)",
                        borderRadius: 2,
                        border: "1px solid rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#10b981",
                          fontWeight: 600,
                          mb: 1,
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Username
                      </Typography>{" "}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {profile?.data?.username ||
                          profile?.data?.display_name ||
                          "Not provided"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 3,
                        background:
                          "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.02) 100%)",
                        borderRadius: 2,
                        border: "1px solid rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#10b981",
                          fontWeight: 600,
                          mb: 1,
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Email
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile?.data?.email}
                        </Typography>
                        {profile?.data?.verified_email && (
                          <CheckCircleIcon
                            sx={{ color: "#10b981", fontSize: 20 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {profile?.data?.locale && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(16, 185, 129, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#10b981",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Locale
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile.data.locale}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {profile?.data?.social_provider && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Connected Account
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile.data.social_provider}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {profile?.data?.login_count !== undefined && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 3,
                          background:
                            "linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
                          borderRadius: 2,
                          border: "1px solid rgba(168, 85, 247, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#a855f7",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Login Count
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          {profile.data.login_count} logins
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
