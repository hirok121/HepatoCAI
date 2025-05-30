import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import NavBar from "../../components/layout/NavBar";

function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "What is hepatitis?",
      answer:
        "Hepatitis is inflammation of the liver. It can be caused by viruses, toxins, medications, or autoimmune conditions. The most common types are hepatitis A, B, and C.",
    },
    {
      question: "How is hepatitis transmitted?",
      answer:
        "Transmission varies by type. Hepatitis A and E are typically spread through contaminated food or water. Hepatitis B and C are spread through blood contact, sexual contact, or from mother to child during birth.",
    },
    {
      question: "What are the symptoms of hepatitis?",
      answer:
        "Common symptoms include fatigue, nausea, abdominal pain, jaundice (yellowing of skin and eyes), dark urine, and loss of appetite. Some people may have no symptoms.",
    },
    {
      question: "Is hepatitis curable?",
      answer:
        "It depends on the type. Hepatitis A usually resolves on its own. Hepatitis B can be managed with medication. Hepatitis C is now curable in most cases with direct-acting antiviral drugs.",
    },
    {
      question: "How can I prevent hepatitis?",
      answer:
        "Prevention methods include vaccination (for hepatitis A and B), practicing safe sex, not sharing needles, ensuring safe blood transfusions, and maintaining good hygiene.",
    },
    {
      question: "When should I see a doctor?",
      answer:
        "See a doctor if you experience symptoms like persistent fatigue, abdominal pain, jaundice, or if you think you've been exposed to hepatitis. Regular screening is recommended for high-risk individuals.",
    },
    {
      question: "Can I live a normal life with hepatitis?",
      answer:
        "Yes, many people with hepatitis live normal, healthy lives with proper medical care and lifestyle modifications. Early detection and treatment are key.",
    },
    {
      question: "Are there dietary restrictions with hepatitis?",
      answer:
        "Generally, maintain a healthy diet, limit alcohol (or avoid completely), stay hydrated, and avoid raw or undercooked foods. Your doctor may provide specific dietary guidance.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <HelpIcon sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find answers to common questions about hepatitis
            </Typography>
          </Box>

          {/* Search Box */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* FAQ Accordions */}
          {filteredFAQs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                borderRadius: "12px",
                "&:before": { display: "none" },
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  "&.Mui-expanded": {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          {filteredFAQs.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No FAQs found matching your search.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default FAQ;
