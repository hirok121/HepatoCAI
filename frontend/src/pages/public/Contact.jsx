import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "../../services/api";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import NavBar from "../../components/layout/NavBar";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("users/contact/me/", formData);
      console.log("Response:", response.data);

      if (response.data.status === "success") {
        setNotification({
          open: true,
          message: response.data.message,
          severity: "success",
        });

        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: "Email",
      content: "hirokrezawww1@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: <PhoneIcon />,
      title: "Phone",
      content: "(+88) 01516562365",
      description: "Call us during business hours",
    },
    {
      icon: <LocationOnIcon />,
      title: "Address",
      content:
        "Station Rd, Rajshahi 6204, Rajshahi University of Engineering & Technology(RUET)",
      description: "Visit our main office",
    },
    {
      icon: <AccessTimeIcon />,
      title: "Business Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "We're here to help",
    },
  ];
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <ContactSupportIcon
              sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get in touch with our team for support, questions, or feedback
            </Typography>
          </Box>{" "}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "stretch",
              mb: 4,
            }}
          >
            {/* Contact Form */}
            <Box sx={{ flex: { lg: 2 } }}>
              <Paper sx={{ p: 4, borderRadius: "16px", height: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Send us a Message
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        flexDirection: { xs: "column", md: "row" },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={10}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />{" "}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <SendIcon />
                      }
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                        alignSelf: "flex-end",
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Box>
            {/* Contact Information */}
            <Box sx={{ flex: { lg: 1 } }}>
              <Paper sx={{ p: 4, borderRadius: "16px", height: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Get in Touch
                </Typography>
                <List sx={{ p: 0 }}>
                  {contactInfo.map((info, index) => (
                    <ListItem key={index} sx={{ px: 0, mb: 2 }}>
                      <ListItemIcon sx={{ color: "#2563EB", minWidth: "40px" }}>
                        {info.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700 }}
                          >
                            {info.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {info.content}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {info.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
          {/* Emergency Contact - Full Width */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#dc3545" }}
            >
              Emergency?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              For medical emergencies, please contact your healthcare provider
              immediately or call emergency services.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Emergency Hotline: 911
            </Typography>{" "}
          </Paper>
        </Box>
      </Container>{" "}
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Contact;
