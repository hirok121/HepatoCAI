import { useRef, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import PropTypes from "prop-types";
import MessageBubble from "./MessageBubble";

const ChatMessages = ({
  messages,
  isLoading = false,
  loadingMessage = false,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Loading skeleton component
  const MessageSkeleton = () => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        maxWidth: "70%",
        animation: "pulse 1.5s ease-in-out infinite",
        "@keyframes pulse": {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.7 },
          "100%": { opacity: 1 },
        },
      }}
    >
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{ flexShrink: 0 }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="75%" height={16} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        py: 2,
        backgroundColor: "#ffffff",
        minHeight: 0, // Important for flex scroll
      }}
    >
      {messages.length === 0 && !isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            px: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              HepatoC AI Assistant
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 2,
            }}
          >
            How can I help you today?
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            I&apos;m HepatoCAI Assistant, your specialized AI companion for
            Hepatitis C education and support. I can help you understand HCV
            stages, laboratory results, treatment options, and provide
            evidence-based information about liver health.
          </Typography>
        </Box>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Loading message for AI response */}
          {loadingMessage && (
            <MessageBubble message={loadingMessage} isLoading={true} />
          )}

          {/* Skeletons for loading state */}
          {isLoading && (
            <Box sx={{ px: 2 }}>
              <MessageSkeleton />
            </Box>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(["user", "ai"]).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.bool,
};

export default ChatMessages;
