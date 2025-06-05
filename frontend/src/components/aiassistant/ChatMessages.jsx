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
        py: 3,
        background:
          "linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)",
        backdropFilter: "blur(10px)",
        minHeight: 0, // Important for flex scroll
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23e2e8f0" opacity="0.4"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>\')',
          opacity: 0.3,
          zIndex: 0,
        },
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(226, 232, 240, 0.3)",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(180deg, #2563EB 0%, #7c3aed 100%)",
          borderRadius: "3px",
          "&:hover": {
            background: "linear-gradient(180deg, #1D4ED8 0%, #6d28d9 100%)",
          },
        },
      }}
    >
      {" "}
      {messages.length === 0 && !isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            px: 4,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "140px",
                height: "140px",
                background:
                  "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)",
                borderRadius: "50%",
                animation: "pulse 3s ease-in-out infinite",
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                fontSize: "3rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              AI
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            How can I help you today?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 600,
              lineHeight: 1.7,
              color: "#64748b",
              fontSize: { xs: "1rem", md: "1.1rem" },
              fontWeight: 400,
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
