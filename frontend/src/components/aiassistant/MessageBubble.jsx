import { Box, Typography, Paper, Avatar } from "@mui/material";
import {
  Person as PersonIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";

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
        {" "}
        {/* Avatar */}
        <Box
          sx={{
            mx: 1.5,
            flexShrink: 0,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: isUser
                ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                : "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
              color: isUser ? "white" : "#2563EB",
              backdropFilter: "blur(10px)",
              border: isUser ? "none" : "1px solid rgba(37, 99, 235, 0.2)",
              boxShadow: isUser
                ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                : "0 4px 12px rgba(37, 99, 235, 0.1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isUser ? (
              <PersonIcon sx={{ fontSize: "1.3rem" }} />
            ) : (
              <SmartToyIcon sx={{ fontSize: "1.3rem" }} />
            )}
          </Avatar>
        </Box>
        {/* Message Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              backgroundColor: isUser ? "#2563EB" : "#F0F4F8",
              color: isUser ? "white" : "#1E293B",
              borderRadius: "16px",
              border: isUser ? "none" : "1px solid #E2E8F0",
              position: "relative",
              wordBreak: "break-word",
              ...(isUser
                ? {
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
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
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    "& > div": {
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#2563EB",
                      animation: "typing 1.4s ease-in-out infinite",
                    },
                    "& > div:nth-of-type(1)": { animationDelay: "0s" },
                    "& > div:nth-of-type(2)": { animationDelay: "0.2s" },
                    "& > div:nth-of-type(3)": { animationDelay: "0.4s" },
                    "@keyframes typing": {
                      "0%, 60%, 100%": {
                        transform: "translateY(0)",
                        opacity: 0.4,
                      },
                      "30%": {
                        transform: "translateY(-10px)",
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <div />
                  <div />
                  <div />
                </Box>
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
                    color: isUser ? "rgba(255, 255, 255, 0.8)" : "#475569",
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

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    is_from_user: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
};

export default MessageBubble;
