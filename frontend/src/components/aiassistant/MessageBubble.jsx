import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";

const MessageBubble = ({ message, isLoading = false }) => {
  const isUser = message.is_from_user;
  const isAI = !isUser;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 3,
        px: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          maxWidth: { xs: "85%", sm: "70%", md: "60%" },
          flexDirection: isUser ? "row-reverse" : "row",
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            mx: 1.5,
            flexShrink: 0,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: isUser ? "#2563EB" : "#f1f5f9",
              color: isUser ? "white" : "#2563EB",
            }}
          >
            {isUser ? (
              <PersonIcon sx={{ fontSize: "1.2rem" }} />
            ) : (
              <SmartToyIcon sx={{ fontSize: "1.2rem" }} />
            )}
          </Avatar>
        </Box>

        {/* Message Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              backgroundColor: isUser ? "#2563EB" : "#f8fafc",
              color: isUser ? "white" : "#1e293b",
              borderRadius: "16px",
              border: isUser ? "none" : "1px solid #e2e8f0",
              position: "relative",
              wordBreak: "break-word",
              ...(isUser
                ? {
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  }
                : {}),
            }}
          >
            {/* Loading indicator for AI responses */}
            {isLoading && isAI ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={16} sx={{ color: "#2563EB" }} />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.content}
                </Typography>

                {/* Timestamp */}
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    opacity: 0.7,
                    fontSize: "0.75rem",
                    color: isUser
                      ? "rgba(255, 255, 255, 0.8)"
                      : "text.secondary",
                  }}
                >
                  {formatTime(message.created_at)}
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageBubble;
