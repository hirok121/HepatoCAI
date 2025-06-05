import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Divider,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";

const ChatSidebar = ({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onEditChat,
  onArchiveChat,
  isLoading = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedChatId, setSelectedChatId] = React.useState(null);

  // Modern theme configuration
  const theme = {
    colors: {
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        900: "#1e3a8a",
      },
      neutral: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        600: "#475569",
        700: "#334155",
        900: "#0f172a",
      },
    },
    glassmorphism: {
      light: "rgba(255, 255, 255, 0.25)",
      medium: "rgba(255, 255, 255, 0.18)",
      backdrop: "blur(16px)",
    },
  };

  const handleMenuOpen = (event, chatId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedChatId(chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChatId(null);
  };

  const handleEditTitle = () => {
    if (onEditChat && selectedChatId) {
      onEditChat(selectedChatId);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDeleteChat && selectedChatId) {
      onDeleteChat(selectedChatId);
    }
    handleMenuClose();
  };

  const handleArchive = () => {
    if (onArchiveChat && selectedChatId) {
      onArchiveChat(selectedChatId);
    }
    handleMenuClose();
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return "New Chat";
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(145deg, ${theme.glassmorphism.light} 0%, ${theme.colors.neutral[50]} 100%)`,
        backdropFilter: theme.glassmorphism.backdrop,
        borderRight: `1px solid ${theme.glassmorphism.medium}`,
        boxShadow: `inset 1px 0 0 ${theme.glassmorphism.light}`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
        },
      }}
    >
      {" "}
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.glassmorphism.medium}`,
          background: `linear-gradient(135deg, ${theme.glassmorphism.light} 0%, ${theme.colors.neutral[100]} 100%)`,
          backdropFilter: "blur(20px)",
          position: "relative",
        }}
      >
        {" "}
        <Button
          fullWidth
          variant="contained"
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AddIcon sx={{ fontSize: 20 }} />
            )
          }
          onClick={onNewChat}
          disabled={isLoading}
          sx={{
            background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 50%, #8b5cf6 100%)`,
            color: "white",
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.02em",
            py: 3,
            px: 4,
            boxShadow: `0 12px 40px ${theme.colors.primary[600]}40`,
            border: `2px solid ${theme.glassmorphism.light}`,
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.colors.primary[700]} 0%, ${theme.colors.primary[900]} 50%, #7c3aed 100%)`,
              transform: "translateY(-3px) scale(1.02)",
              boxShadow: `0 20px 60px ${theme.colors.primary[600]}50`,
              "&::after": {
                opacity: 1,
              },
            },
            "&:active": {
              transform: "translateY(-1px) scale(1.01)",
            },
            "&:disabled": {
              background: `linear-gradient(135deg, ${theme.colors.neutral[200]} 0%, ${theme.colors.neutral[300]} 100%)`,
              color: theme.colors.neutral[500],
              transform: "none",
              boxShadow: "none",
            },
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
              transition: "left 0.8s ease",
            },
            "&:hover::before": {
              left: "100%",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "24px",
              padding: "2px",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent, rgba(255, 255, 255, 0.4))",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              opacity: 0,
              transition: "opacity 0.3s ease",
            },
          }}
        >
          {isLoading ? "Creating New Chat..." : "🚀 Start New Chat"}
        </Button>
      </Box>{" "}
      {/* Chat List */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          py: 1,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "10px",
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            },
          },
        }}
      >
        {isLoading ? (
          // Loading skeleton for chat list
          <List sx={{ px: 1 }}>
            {" "}
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  mb: 0.5,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 2, width: "100%" }}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 0.5,
                    }}
                  >
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton variant="rounded" width={30} height={16} />
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : chats.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
              color: "text.secondary",
              px: 3,
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              borderRadius: "24px",
              mx: 2,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-1px",
                left: "-1px",
                right: "-1px",
                bottom: "-1px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                borderRadius: "24px",
                zIndex: -1,
                opacity: 0.1,
              },
            }}
          >
            <Box
              sx={{
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            >
              <ChatIcon
                sx={{ fontSize: 64, mb: 2, opacity: 0.6, color: "#667eea" }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome to AI Chat
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ opacity: 0.7 }}
            >
              Start your first conversation and explore the possibilities
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 1 }}>
            {chats
              .filter((chat) => chat && chat.id) // Filter out invalid chat objects
              .map((chat) => (
                <ListItem
                  key={chat.id}
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {" "}
                  <ListItemButton
                    selected={currentChatId === chat.id}
                    onClick={() => onChatSelect(chat.id)}
                    sx={{
                      borderRadius: "16px",
                      mx: 1,
                      my: 0.5,
                      background:
                        currentChatId === chat.id
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : `rgba(255, 255, 255, 0.6)`,
                      backdropFilter: "blur(12px)",
                      border:
                        currentChatId === chat.id
                          ? `1px solid ${theme.glassmorphism.light}`
                          : `1px solid ${theme.glassmorphism.medium}`,
                      "&.Mui-selected": {
                        color: "white",
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.25)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                        },
                      },
                      "&:hover": {
                        backgroundColor:
                          currentChatId === chat.id
                            ? undefined
                            : "rgba(102, 126, 234, 0.08)",
                        transform: "translateX(4px)",
                        boxShadow:
                          currentChatId === chat.id
                            ? "0 12px 40px rgba(102, 126, 234, 0.35)"
                            : "0 4px 20px rgba(0, 0, 0, 0.08)",
                        "&::after": {
                          opacity: 1,
                          transform: "scale(1)",
                        },
                      },
                      px: 3,
                      py: 2.5,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        width: "3px",
                        height: "60%",
                        background:
                          "linear-gradient(to bottom, transparent, #667eea, transparent)",
                        transform: "translateY(-50%) scale(0)",
                        opacity: 0,
                        transition: "all 0.3s ease",
                        borderRadius: "2px",
                      },
                    }}
                  >
                    {" "}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        component="div"
                        noWrap
                        sx={{
                          color:
                            currentChatId === chat.id ? "white" : "inherit",
                        }}
                      >
                        {truncateTitle(chat.title)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{
                            color:
                              currentChatId === chat.id
                                ? "rgba(255, 255, 255, 0.7)"
                                : "text.secondary",
                          }}
                        >
                          {formatDate(chat.updated_at)}
                        </Typography>
                        {chat.message_count > 0 && (
                          <Chip
                            size="small"
                            label={chat.message_count}
                            sx={{
                              height: 16,
                              fontSize: "0.6rem",
                              backgroundColor:
                                currentChatId === chat.id
                                  ? "rgba(255, 255, 255, 0.2)"
                                  : "rgba(37, 99, 235, 0.1)",
                              color:
                                currentChatId === chat.id ? "white" : "#2563EB",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, chat.id)}
                      sx={{
                        color:
                          currentChatId === chat.id
                            ? "white"
                            : "text.secondary",
                        opacity: 0.7,
                        "&:hover": {
                          opacity: 1,
                          backgroundColor:
                            currentChatId === chat.id
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}{" "}
          </List>
        )}{" "}
        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 8px 32px rgba(0,0,0,0.15))",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.glassmorphism.light}`,
              borderRadius: "16px",
              mt: 1.5,
              "& .MuiMenuItem-root": {
                borderRadius: "12px",
                mx: 1,
                my: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                },
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderBottom: "none",
                borderRight: "none",
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleEditTitle}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit Title
          </MenuItem>
          <MenuItem onClick={handleArchive}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            Archive
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </Box>{" "}
      {/* Footer */}
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }} />
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.glassmorphism.light} 0%, ${theme.colors.neutral[100]} 100%)`,
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${theme.glassmorphism.medium}`,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <Typography
            variant="caption"
            sx={{
              color: theme.colors.neutral[600],
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            💬 {chats.length} conversation{chats.length !== 1 ? "s" : ""}
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.4)",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.5 },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

ChatSidebar.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      updated_at: PropTypes.string.isRequired,
      message_count: PropTypes.number.isRequired,
    })
  ).isRequired,
  currentChatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChatSelect: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func,
  onEditChat: PropTypes.func,
  onArchiveChat: PropTypes.func,
  isLoading: PropTypes.bool,
};

ChatSidebar.defaultProps = {
  currentChatId: null,
  onDeleteChat: () => {},
  onEditChat: () => {},
  onArchiveChat: () => {},
  isLoading: false,
};

export default ChatSidebar;
