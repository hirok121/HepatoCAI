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
        backgroundColor: "#f8fafc",
        borderRight: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "white",
        }}
      >
        {" "}
        <Button
          fullWidth
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={onNewChat}
          disabled={isLoading}
          sx={{
            borderColor: "#2563EB",
            color: "#2563EB",
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.04)",
              borderColor: "#1D4ED8",
            },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {isLoading ? "Loading..." : "New Chat"}
        </Button>
      </Box>{" "}
      {/* Chat List */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        {isLoading ? (
          // Loading skeleton for chat list
          <List sx={{ px: 1 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  mb: 0.5,
                  borderRadius: "8px",
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
              height: "200px",
              color: "text.secondary",
              px: 2,
            }}
          >
            <ChatIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" textAlign="center">
              No conversations yet. Start a new chat to begin!
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
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {" "}
                  <ListItemButton
                    selected={currentChatId === chat.id}
                    onClick={() => onChatSelect(chat.id)}
                    sx={{
                      borderRadius: "8px",
                      "&.Mui-selected": {
                        backgroundColor: "#2563EB",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#1D4ED8",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.08)",
                      },
                      px: 2,
                      py: 1.5,
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
        )}

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
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
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
      </Box>
      {/* Footer */}
      <Divider />
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center" }}
        >
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </Typography>
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
