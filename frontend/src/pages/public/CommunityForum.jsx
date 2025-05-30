import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import AddIcon from "@mui/icons-material/Add";
import ReplyIcon from "@mui/icons-material/Reply";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import NavBar from "../../components/layout/NavBar";

function CommunityForum() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Topics", count: 156 },
    { id: "diagnosis", label: "Diagnosis", count: 45 },
    { id: "treatment", label: "Treatment", count: 67 },
    { id: "support", label: "Support", count: 34 },
    { id: "lifestyle", label: "Lifestyle", count: 28 },
  ];

  const forumPosts = [
    {
      id: 1,
      title: "Newly diagnosed with Hepatitis B - What should I expect?",
      author: "JohnD",
      category: "diagnosis",
      replies: 12,
      likes: 8,
      lastActivity: "2 hours ago",
      preview:
        "Hi everyone, I was just diagnosed with Hepatitis B and feeling overwhelmed...",
    },
    {
      id: 2,
      title: "Share your experience with new Hepatitis C treatments",
      author: "SarahM",
      category: "treatment",
      replies: 23,
      likes: 15,
      lastActivity: "4 hours ago",
      preview:
        "I wanted to share my positive experience with the new DAA treatments...",
    },
    {
      id: 3,
      title: "Diet and nutrition tips for liver health",
      author: "HealthyLiving",
      category: "lifestyle",
      replies: 18,
      likes: 22,
      lastActivity: "6 hours ago",
      preview:
        "Here are some evidence-based nutrition tips that have helped me...",
    },
    {
      id: 4,
      title: "Coping with fatigue - What works for you?",
      author: "TiredButStrong",
      category: "support",
      replies: 31,
      likes: 28,
      lastActivity: "8 hours ago",
      preview:
        "Fatigue has been my biggest challenge. What strategies have worked for you?",
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === selectedCategory);
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <ForumIcon sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Community Forum
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connect with others, share experiences, and get support
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Categories Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, borderRadius: "16px" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Categories
                </Typography>
                <List sx={{ p: 0 }}>
                  {categories.map((category) => (
                    <ListItem
                      key={category.id}
                      button
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        backgroundColor:
                          selectedCategory === category.id
                            ? "#2563EB"
                            : "transparent",
                        color:
                          selectedCategory === category.id
                            ? "white"
                            : "inherit",
                        "&:hover": {
                          backgroundColor:
                            selectedCategory === category.id
                              ? "#1d4ed8"
                              : "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemText
                        primary={category.label}
                        secondary={`${category.count} posts`}
                        secondaryTypographyProps={{
                          color:
                            selectedCategory === category.id
                              ? "rgba(255,255,255,0.7)"
                              : "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#2563EB",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  New Post
                </Button>
              </Paper>
            </Grid>
            {/* Forum Posts */}
            <Grid item xs={12} md={9}>
              {filteredPosts.map((post) => (
                <Paper key={post.id} sx={{ p: 3, mb: 3, borderRadius: "16px" }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Avatar sx={{ backgroundColor: "#2563EB" }}>
                      {post.author.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {post.title}
                        </Typography>
                        <Chip
                          label={
                            categories.find((c) => c.id === post.category)
                              ?.label || post.category
                          }
                          size="small"
                          sx={{ backgroundColor: "#e3f2fd" }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        by {post.author} • {post.lastActivity}
                      </Typography>

                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {post.preview}
                      </Typography>

                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          startIcon={<ReplyIcon />}
                          sx={{ color: "#2563EB" }}
                        >
                          {post.replies} Replies
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          sx={{ color: "#2563EB" }}
                        >
                          {post.likes} Likes
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>{" "}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default CommunityForum;
