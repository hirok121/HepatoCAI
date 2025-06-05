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
        px: 2,
        background: "rgba(249, 250, 251, 0.95)",
        minHeight: 0,
        position: "relative",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(243, 244, 246, 0.5)",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(156, 163, 175, 0.5)",
          borderRadius: "2px",
          "&:hover": {
            background: "rgba(107, 114, 128, 0.7)",
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
          {/* Enhanced AI Avatar */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "30px",
              background:
                "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 6,
              position: "relative",
              boxShadow: "0 25px 50px rgba(79, 70, 229, 0.25)",
              transform: "translateY(0px)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-8px) scale(1.05)",
                boxShadow: "0 35px 70px rgba(79, 70, 229, 0.35)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-6px",
                left: "-6px",
                right: "-6px",
                bottom: "-6px",
                background:
                  "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
                borderRadius: "36px",
                opacity: 0.15,
                animation: "pulse 3s ease-in-out infinite",
                filter: "blur(8px)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "140px",
                height: "140px",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                borderRadius: "50%",
                animation: "ripple 2s linear infinite",
              },
              "@keyframes pulse": {
                "0%, 100%": { opacity: 0.15 },
                "50%": { opacity: 0.3 },
              },
              "@keyframes ripple": {
                "0%": {
                  transform: "translate(-50%, -50%) scale(1)",
                  opacity: 1,
                },
                "100%": {
                  transform: "translate(-50%, -50%) scale(1.5)",
                  opacity: 0,
                },
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "3.5rem",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
                position: "relative",
                zIndex: 2,
              }}
            >
              🩺
            </Typography>
          </Box>
          {/* Enhanced Welcome Text */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #1E293B 0%, #475569 50%, #64748B 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              fontSize: { xs: "2.2rem", md: "3rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            HepatoC AI Assistant
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              color: "#64748B",
              mb: 6,
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              maxWidth: 600,
              lineHeight: 1.5,
            }}
          >
            Your specialized AI companion for Hepatitis C education, treatment
            guidance, and personalized health support
          </Typography>
          {/* Enhanced Feature Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              maxWidth: 900,
              mb: 6,
            }}
          >
            {[
              {
                icon: "🔬",
                title: "Lab Analysis",
                desc: "Interpret test results",
                color: "#10B981",
              },
              {
                icon: "💊",
                title: "Treatment Guide",
                desc: "Explore options",
                color: "#3B82F6",
              },
              {
                icon: "📊",
                title: "Progress Track",
                desc: "Monitor health",
                color: "#8B5CF6",
              },
              {
                icon: "🎯",
                title: "Care Plans",
                desc: "Personalized advice",
                color: "#F59E0B",
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "20px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  backdropFilter: "blur(20px)",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.1)`,
                    border: `1px solid ${feature.color}40`,
                    background: "rgba(255, 255, 255, 0.95)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: `${feature.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "1.5rem" }}>
                    {feature.icon}
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#1E293B", mb: 1 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748B", fontSize: "0.9rem" }}
                >
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>{" "}
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
