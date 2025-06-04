import { useState, useEffect } from "react";
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
      // Fetch data from API
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

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const handleNewChat = async () => {
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
  };
  const handleChatSelect = async (chatId) => {
    try {
      setCurrentChatId(chatId);
      setChatMessageLoading(true);
      setIsLoading(true);
      setMessages([]); // Clear messages immediately

      // Try to fetch chat details from backend
      const response = await aiAssistantService.getChatDetails(chatId);
      console.log("API response getChatDetails:", response);

      if (response.success && response.data) {
        const chatData = response.data;
        // Handle different possible response structures
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
    // Create new chat if none selected
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
    } // Add user message to UI immediately
    const userMessage = {
      id: generateUniqueId("user_"),
      content: messageContent,
      is_from_user: true,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    try {
      // Try to send message to backend
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
        // The backend response should include both user message and AI response
        const { user_message, ai_message, chat_title } = response.data; // Update messages with the actual server response
        setMessages((prev) => {
          // Remove the temporary user message and add the server messages
          const withoutTemp = prev.filter((msg) => msg.id !== userMessage.id);

          // Ensure server messages have valid IDs
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

        // Update chat in the list if title was auto-generated
        if (chat_title) {
          setChats((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, title: chat_title } : c))
          );
        }
      } else {
        // Backend API failed
        console.warn("Backend API failed");
        setError("Failed to send message");
        // Remove the user message since sending failed
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      }
    } catch (error) {
      console.warn("Backend not available:", error);
      setError("Backend service is currently unavailable");
      // Remove the user message since sending failed
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

        // If we're deleting the current chat, clear the current selection
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
    // For now, show a simple prompt - in production, you'd use a proper modal
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

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            PaperProps={{
              sx: { width: 280 },
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
              transition: "width 0.3s ease",
              overflow: "hidden",
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
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {currentChatId ? (
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
              }}
            >
              {" "}
              {/* Messages */}
              <ChatMessages
                messages={messages}
                isLoading={chatMessageLoading}
                loadingMessage={messageLoading}
              />
              {/* Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                showQuickQuestions={messages.length == 0}
              />
            </Paper>
          ) : (
            // Welcome Screen
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f8fafc",
                position: "relative",
              }}
            >
              {/* Mobile Header with Hamburger Menu */}
              {isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    py: 2,
                    backgroundColor: "white",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <IconButton
                    onClick={handleToggleSidebar}
                    sx={{
                      color: "#2563EB",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.08)",
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
                      ml: 2,
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
                  px: 3,
                  textAlign: "center",
                }}
              >
                <PsychologyIcon
                  sx={{ fontSize: "4rem", color: "#2563EB", mb: 3 }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "#1e293b",
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  HepatoCAI Assistant
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 600, lineHeight: 1.6, mb: 4 }}
                >
                  Your specialized AI companion for Hepatitis C education and
                  support. Ask me anything about HCV stages, liver health, lab
                  results, and treatment options to get evidence-based
                  information.
                </Typography>

                {!isMobile && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ opacity: 0.7 }}
                  >
                    Start a new conversation or select from your chat history
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>{" "}
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AIAssistant;
