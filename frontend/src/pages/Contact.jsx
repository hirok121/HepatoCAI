import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: "Email",
      content: "support@hepatocai.com",
      description: "Send us an email anytime",
    },
    {
      icon: <PhoneIcon />,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Call us during business hours",
    },
    {
      icon: <LocationOnIcon />,
      title: "Address",
      content: "123 Medical Center Drive, Health City, HC 12345",
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
        </Box>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 4, borderRadius: "16px" }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Send us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: "16px", height: "fit-content" }}>
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
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
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

            {/* Emergency Contact */}
            <Paper
              sx={{
                p: 3,
                borderRadius: "16px",
                mt: 3,
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
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Contact;
