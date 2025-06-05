import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Drawer,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MenuIcon from "@mui/icons-material/Menu";
import NavBar from "../components/layout/NavBar";
import ChatSidebar from "../components/aiassistant/ChatSidebar";
import ChatMessages from "../components/aiassistant/ChatMessages";
import ChatInput from "../components/aiassistant/ChatInput";
import { aiAssistantService } from "../services/aiAssistantAPI";

// Helper function to generate unique IDs
const generateUniqueId = (prefix = "") => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

function AIAssistant() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageLoading, setmessageLoading] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [chatMessageLoading, setChatMessageLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [error, setError] = useState(null);

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setSidebarLoading(true);
    setIsLoading(true);
    try {
      const response = await aiAssistantService.getChats();
      console.log("API response getchats:", response);
      if (response.success) {
        setChats(response.data);
      } else {
        console.warn("API not available");
        setChats([]);
        setError("Unable to load chats. Please check your connection.");
      }
    } catch (error) {
      console.warn("Backend not available:", error);
      setChats([]);
      setError(
        "Backend service is currently unavailable. Please try again later."
      );
    } finally {
      setSidebarLoading(false);
      setIsLoading(false);
    }
  };
  const handleNewChat = useCallback(async () => {
    try {
      setSidebarLoading(true);
      setIsLoading(true);
      const response = await aiAssistantService.createChat();
      console.log("API response createChat:", response);
      if (response.success) {
        const newChat = response.data.chat;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        setMessages([]);
        console.log("New chat created:", newChat);
        if (isMobile) setSidebarOpen(false);
      } else {
        setError("Failed to create new chat");
        return;
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      setError("Failed to create new chat");
    } finally {
      setSidebarLoading(false);
      setIsLoading(false);
    }
  }, [isMobile]);

  const handleChatSelect = async (chatId) => {
    try {
      setCurrentChatId(chatId);
      setChatMessageLoading(true);
      setIsLoading(true);
      setMessages([]);

      const response = await aiAssistantService.getChatDetails(chatId);
      console.log("API response getChatDetails:", response);

      if (response.success && response.data) {
        const chatData = response.data;
        const messages = chatData.chat?.messages;
        console.log("Loading messages for chat:", chatId, messages);
        setMessages(messages);
      } else {
        console.warn(
          "Could not load chat from backend:",
          response.error || "Unknown error"
        );
        setMessages([]);
        setError("Failed to load chat messages");
      }

      if (isMobile) setSidebarOpen(false);
    } catch (error) {
      console.error("Error loading chat:", error);
      setMessages([]);
      setError("Failed to load chat messages");
      if (isMobile) setSidebarOpen(false);
    } finally {
      setChatMessageLoading(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent) => {
    let chatId = currentChatId;
    setmessageLoading(true);
    setIsLoading(true);

    if (!chatId) {
      try {
        const response = await aiAssistantService.createChat();
        if (response.success) {
          chatId = response.data.id;
          setCurrentChatId(chatId);
          setChats((prev) => [response.data, ...prev]);
        } else {
          setError("Failed to create new chat");
          return;
        }
      } catch (error) {
        setError("Failed to create new chat");
        return;
      }
    }

    const userMessage = {
      id: generateUniqueId("user_"),
      content: messageContent,
      is_from_user: true,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log(
        "Sending message - chatId:",
        chatId,
        "messageContent:",
        messageContent
      );
      const response = await aiAssistantService.sendMessage(
        chatId,
        messageContent
      );
      console.log("API response sendMessage:", response);

      if (response.success) {
        const { user_message, ai_message, chat_title } = response.data;

        setMessages((prev) => {
          const withoutTemp = prev.filter((msg) => msg.id !== userMessage.id);

          const validUserMessage = {
            ...user_message,
            id: user_message.id || generateUniqueId("server_user_"),
          };

          const validAiMessage = {
            ...ai_message,
            id: ai_message.id || generateUniqueId("server_ai_"),
          };

          return [...withoutTemp, validUserMessage, validAiMessage];
        });

        if (chat_title) {
          setChats((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, title: chat_title } : c))
          );
        }
      } else {
        console.warn("Backend API failed");
        setError("Failed to send message");
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      }
    } catch (error) {
      console.warn("Backend not available:", error);
      setError("Backend service is currently unavailable");
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setmessageLoading(false);
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatIdToDelete) => {
    setIsLoading(true);
    setSidebarLoading(true);
    try {
      const response = await aiAssistantService.deleteChat(chatIdToDelete);

      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatIdToDelete));

        if (currentChatId === chatIdToDelete) {
          setCurrentChatId(null);
          setMessages([]);
        }
      } else {
        setError(response.error || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      setError("Failed to delete chat");
    } finally {
      setIsLoading(false);
      setSidebarLoading(false);
    }
  };

  const handleEditTitle = async (chatId) => {
    const newTitle = prompt("Enter new chat title:");
    if (newTitle && newTitle.trim()) {
      try {
        const response = await aiAssistantService.updateChat(chatId, {
          title: newTitle.trim(),
        });

        if (response.success) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
            )
          );
        } else {
          setError(response.error || "Failed to update chat title");
        }
      } catch (error) {
        console.error("Error updating chat title:", error);
        setError("Failed to update chat title");
      }
    }
  };
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  // Enhanced animations and transitions
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Keyboard shortcuts for better UX
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault();
            handleNewChat();
            break;
          case "/":
            e.preventDefault();
            // Focus on input if chat is open
            if (currentChatId) {
              const inputElement = document.querySelector(
                'textarea, input[type="text"]'
              );
              inputElement?.focus();
            }
            break;
          case "b":
            e.preventDefault();
            handleToggleSidebar();
            break;
        }
      }

      // ESC to close sidebar on mobile
      if (e.key === "Escape" && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [
    currentChatId,
    isMobile,
    sidebarOpen,
    handleNewChat,
    handleToggleSidebar,
  ]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        position: "relative",
        // Add subtle pattern overlay
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
          pointerEvents: "none",
        },
        // Enhanced pulse animation
        "@keyframes pulse": {
          "0%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 0.7,
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(1.1)",
            opacity: 0.4,
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 0.7,
          },
        },
        // Add floating animation for background elements
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }}
    >
      <NavBar />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          margin: { xs: 0, md: 1 },
          borderRadius: { xs: 0, md: "16px 16px 0 0" },
          boxShadow: {
            xs: "none",
            md: "0 -10px 25px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <ChatSidebar
              chats={chats}
              currentChatId={currentChatId}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onEditChat={handleEditTitle}
              isLoading={sidebarLoading}
            />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: sidebarOpen ? 280 : 0,
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)",
              borderRight: sidebarOpen
                ? "1px solid rgba(255, 255, 255, 0.3)"
                : "none",
              backdropFilter: "blur(20px) saturate(180%)",
              // Add subtle inner shadow
              boxShadow: sidebarOpen
                ? "inset -1px 0 0 rgba(255, 255, 255, 0.1)"
                : "none",
            }}
          >
            <ChatSidebar
              chats={chats}
              currentChatId={currentChatId}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onEditChat={handleEditTitle}
              isLoading={sidebarLoading}
            />
          </Box>
        )}

        {/* Main Chat Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {currentChatId ? (
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(226, 232, 240, 0.5)",
                borderRadius: { xs: 0, md: "16px" },
                margin: { xs: 0, md: 2 },
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <ChatMessages
                messages={messages}
                isLoading={chatMessageLoading}
                loadingMessage={messageLoading}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                showQuickQuestions={messages.length === 0}
              />
            </Paper>
          ) : (
            // Welcome Screen
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                position: "relative",
                margin: { xs: 0, md: 2 },
                borderRadius: { xs: 0, md: "16px" },
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e2e8f0" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>\')',
                  opacity: 0.3,
                  zIndex: 0,
                },
              }}
            >
              {/* Mobile Header with Hamburger Menu */}
              {isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                    position: "relative",
                    zIndex: 1,
                    // Add subtle top border glow
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
                    },
                  }}
                >
                  <IconButton
                    onClick={handleToggleSidebar}
                    sx={{
                      color: "#2563EB",
                      background: "rgba(37, 99, 235, 0.1)",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.15)",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#1e293b",
                      ml: 3,
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    HepatoCAI Assistant
                  </Typography>
                </Box>
              )}

              {/* Welcome Content */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 4,
                  py: 6,
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Animated Icon */}
                <Box
                  sx={{
                    position: "relative",
                    mb: 4,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "120px",
                      height: "120px",
                      background:
                        "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)",
                      borderRadius: "50%",
                      animation: "pulse 2s ease-in-out infinite",
                    },
                  }}
                >
                  <PsychologyIcon
                    sx={{
                      fontSize: "5rem",
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      position: "relative",
                      zIndex: 1,
                      filter: "drop-shadow(0 4px 8px rgba(37, 99, 235, 0.3))",
                    }}
                  />
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #2563EB 50%, #7c3aed 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    letterSpacing: "-0.02em",
                    // Add this for better text rendering
                    textShadow: "none",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                >
                  HepatoCAI Assistant
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#64748b",
                    mb: 4,
                    maxWidth: 700,
                    lineHeight: 1.7,
                    fontWeight: 400,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  Your specialized AI companion for Hepatitis C education and
                  support. Ask me anything about HCV stages, liver health, lab
                  results, and treatment options to get evidence-based
                  information.
                </Typography>

                {/* Feature Cards */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: 3,
                    mt: 4,
                    mb: 4,
                    width: "100%",
                    maxWidth: 900,
                  }}
                >
                  {[
                    {
                      icon: "🩺",
                      title: "Medical Insights",
                      desc: "Get expert information about Hepatitis C",
                      gradient:
                        "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                    },
                    {
                      icon: "📊",
                      title: "Lab Results",
                      desc: "Understand your test results and values",
                      gradient:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    },
                    {
                      icon: "💊",
                      title: "Treatment Options",
                      desc: "Learn about available therapies",
                      gradient:
                        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    },
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 3,
                        background: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "20px", // Slightly more rounded
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        transition:
                          "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Smoother bounce
                        cursor: "pointer",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: feature.gradient,
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          borderRadius: "20px",
                        },
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.02)", // Enhanced lift effect
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                          background: "rgba(255, 255, 255, 0.95)",
                          "&::before": {
                            opacity: 0.05,
                          },
                          "& .feature-icon": {
                            transform: "scale(1.2) rotate(5deg)",
                            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
                          },
                        },
                      }}
                    >
                      <Typography
                        variant="h4"
                        className="feature-icon"
                        sx={{
                          mb: 2,
                          transition:
                            "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          display: "block",
                        }}
                      >
                        {feature.icon}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#1e293b",
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {feature.desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {!isMobile && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#94a3b8",
                      opacity: 0.8,
                      fontStyle: "italic",
                      fontSize: "0.95rem",
                    }}
                  >
                    ✨ Start a new conversation or select from your chat history
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: "300px",
          },
        }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{
            width: "100%",
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            "& .MuiAlert-icon": {
              color: "#dc2626",
            },
            "& .MuiAlert-action": {
              color: "#dc2626",
            },
            boxShadow: "0 8px 25px rgba(220, 38, 38, 0.15)",
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AIAssistant;
