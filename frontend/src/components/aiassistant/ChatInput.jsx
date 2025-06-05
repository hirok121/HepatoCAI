import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";

const ChatInput = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Ask me about hepatitis...",
  showQuickQuestions = true,
}) => {
  const [input, setInput] = useState("");

  const quickQuestions = [
    "What are the HCV stages?",
    "How do I interpret my liver function test results?",
    "What are the latest DAA treatment options?",
    "How can I prevent hepatitis transmission?",
    "What lifestyle changes support liver health?",
  ];

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    if (isLoading) return;
    setInput(question);
  };
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(226, 232, 240, 0.5)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.3) 50%, transparent 100%)",
        },
      }}
    >
      {" "}
      {/* Quick Questions */}
      {showQuickQuestions && (
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3,
            borderBottom: "1px solid rgba(226, 232, 240, 0.3)",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "#64748b",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ✨ Quick questions to get started:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              maxHeight: "80px",
              overflowY: "auto",
            }}
          >
            {quickQuestions.map((question, index) => (
              <Chip
                key={index}
                label={question}
                onClick={() => handleQuickQuestion(question)}
                size="small"
                disabled={isLoading}
                sx={{
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  color: "#475569",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
                    borderColor: "#2563EB",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                    color: "#2563EB",
                  },
                  "&:disabled": {
                    opacity: 0.6,
                    cursor: "not-allowed",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      {/* Input Area */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            p: 1,
            border: "2px solid #E2E8F0",
            borderRadius: "16px",
            backgroundColor: "#F0F4F8",
            "&:focus-within": {
              borderColor: "#2563EB",
              backgroundColor: "#FFFFFF",
            },
            transition: "all 0.2s ease",
          }}
        >
          {/* Text Input */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "0.95rem",
                lineHeight: 1.5,
                "& input": {
                  padding: "8px 12px",
                },
                "& textarea": {
                  padding: "8px 12px",
                },
              },
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {" "}
            {/* Attach File Button */}
            <IconButton
              size="small"
              disabled={isLoading}
              sx={{
                color: "#475569",
                "&:hover": {
                  backgroundColor: "rgba(71, 85, 105, 0.08)",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <AttachFileIcon fontSize="small" />
            </IconButton>
            {/* Voice Input Button */}
            <IconButton
              size="small"
              disabled={isLoading}
              sx={{
                color: "#475569",
                "&:hover": {
                  backgroundColor: "rgba(71, 85, 105, 0.08)",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <MicIcon fontSize="small" />
            </IconButton>
            {/* Send Button */}
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                backgroundColor:
                  input.trim() && !isLoading ? "#2563EB" : "#E2E8F0",
                color: input.trim() && !isLoading ? "white" : "#94A3B8",
                width: 36,
                height: 36,
                "&:hover": {
                  backgroundColor:
                    input.trim() && !isLoading ? "#1D4ED8" : "#E2E8F0",
                },
                "&:disabled": {
                  backgroundColor: "#E2E8F0",
                  color: "#94A3B8",
                },
                transition: "all 0.2s ease",
              }}
            >
              {" "}
              {isLoading ? (
                <CircularProgress size={16} sx={{ color: "#94A3B8" }} />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Paper>

        {/* Input hint */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            px: 1,
            color: "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  showQuickQuestions: PropTypes.bool,
};

export default ChatInput;
