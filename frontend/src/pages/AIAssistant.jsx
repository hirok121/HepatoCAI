import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import NavBar from "../components/layout/NavBar";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm HepatoCAI Assistant, your specialized AI companion for Hepatitis C education and support. I can help you understand HCV stages, laboratory results, treatment options, and provide evidence-based information about liver health. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const quickQuestions = [
    "What are the HCV fibrosis stages (F0-F4)?",
    "How do I interpret my liver function test results?",
    "What are the latest DAA treatment options?",
    "How can I prevent hepatitis transmission?",
    "What lifestyle changes support liver health?",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "Thank you for your question. I'm analyzing your query about hepatitis. This is a simulated response for demonstration purposes.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <PsychologyIcon
              sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }}
            />{" "}
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, color: "#2563EB" }}
            >
              HepatoCAI Assistant
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your specialized AI companion for Hepatitis C education and
              support - Ask me anything about HCV, liver health, and treatment
              options
            </Typography>
          </Box>

          <Paper
            sx={{
              height: "600px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
            }}
          >
            {/* Messages Area */}
            <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      maxWidth: "70%",
                      flexDirection:
                        message.sender === "user" ? "row-reverse" : "row",
                    }}
                  >
                    <Box
                      sx={{
                        mx: 1,
                        p: 1,
                        borderRadius: "50%",
                        backgroundColor:
                          message.sender === "user" ? "#2563EB" : "#f5f5f5",
                      }}
                    >
                      {message.sender === "user" ? (
                        <PersonIcon
                          sx={{ color: "white", fontSize: "1.2rem" }}
                        />
                      ) : (
                        <SmartToyIcon
                          sx={{ color: "#2563EB", fontSize: "1.2rem" }}
                        />
                      )}
                    </Box>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor:
                          message.sender === "user" ? "#2563EB" : "#f5f5f5",
                        color: message.sender === "user" ? "white" : "black",
                        borderRadius: "16px",
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Paper>
                  </Box>
                </Box>
              ))}
            </Box>
            {/* Quick Questions */}
            <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Quick questions:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {quickQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => handleQuickQuestion(question)}
                    size="small"
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            </Box>
            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask me about hepatitis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <IconButton
                  onClick={handleSend}
                  sx={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>{" "}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default AIAssistant;
