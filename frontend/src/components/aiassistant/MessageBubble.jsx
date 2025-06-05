import { Box, Typography, Avatar } from "@mui/material";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

const MessageBubble = ({ message, isLoading = false }) => {
  const isUser = message.is_from_user;

  // Enhanced User and AI avatars
  const UserAvatar = () => (
    <Avatar
      sx={{
        width: 36,
        height: 36,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontSize: "1.1rem",
        boxShadow: "0 3px 10px rgba(102, 126, 234, 0.3)",
        border: "2px solid rgba(255, 255, 255, 0.9)",
      }}
    >
      👤
    </Avatar>
  );

  const AIAvatar = () => (
    <Avatar
      sx={{
        width: 36,
        height: 36,
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        fontSize: "1.1rem",
        boxShadow: "0 3px 10px rgba(79, 70, 229, 0.3)",
        border: "2px solid rgba(255, 255, 255, 0.9)",
      }}
    >
      🤖
    </Avatar>
  );

  // Bouncing dots component for loading
  const BouncingDots = () => (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        "& > div": {
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#64748B",
          animation: "bounce 1.4s ease-in-out infinite",
        },
        "& > div:nth-of-type(1)": { animationDelay: "0s" },
        "& > div:nth-of-type(2)": { animationDelay: "0.2s" },
        "& > div:nth-of-type(3)": { animationDelay: "0.4s" },
        "@keyframes bounce": {
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
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          gap: 2,
          maxWidth: "70%",
          alignItems: "flex-start",
        }}
      >
        {isUser ? <UserAvatar /> : <AIAvatar />}

        <Box
          sx={{
            minWidth: "150px",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: isUser
                ? "20px 20px 4px 20px"
                : "20px 20px 20px 4px",
              background: isUser
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "rgba(255, 255, 255, 0.95)",
              color: isUser ? "#ffffff" : "#2d3748",
              boxShadow: isUser
                ? "0 4px 15px rgba(102, 126, 234, 0.25)"
                : "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: isUser ? "none" : "1px solid rgba(226, 232, 240, 0.8)",
              backdropFilter: "blur(10px)",
              position: "relative",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: isUser
                  ? "0 6px 20px rgba(102, 126, 234, 0.35)"
                  : "0 6px 20px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            {isLoading ? (
              <BouncingDots />
            ) : isUser ? (
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {message.content}
              </Typography>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                        mb: 1,
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      {children}
                    </Typography>
                  ),
                  ul: ({ children }) => (
                    <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                      {children}
                    </Box>
                  ),
                  li: ({ children }) => (
                    <Typography
                      component="li"
                      variant="body1"
                      sx={{ fontSize: "0.95rem", mb: 0.5 }}
                    >
                      {children}
                    </Typography>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
            {message.created_at && !isLoading && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  opacity: 0.7,
                  fontSize: "0.75rem",
                  textAlign: isUser ? "right" : "left",
                }}
              >
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    is_from_user: PropTypes.bool.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
};

export default MessageBubble;
