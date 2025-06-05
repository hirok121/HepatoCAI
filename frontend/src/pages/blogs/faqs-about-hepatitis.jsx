import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ArrowBack, PlayCircle, ExpandMore, Help } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";

function FAQsAboutHepatitis() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is hepatitis?",
      answer:
        "Hepatitis refers to inflammation of the liver, which can be caused by viruses, toxins, or immune responses. It can affect liver function and overall health.",
    },
    {
      question: "How do people get hepatitis?",
      answer:
        "Hepatitis can be contracted through contaminated food or water, contact with infected blood, or unprotected sex. Some types are also spread from mother to child during birth.",
    },
    {
      question: "Is hepatitis always a lifelong condition?",
      answer:
        "Not always. Some forms, like hepatitis A, are usually short-term. Others, such as hepatitis B and C, can become chronic if not treated.",
    },
    {
      question: "Can hepatitis be prevented?",
      answer:
        "Vaccines are available for hepatitis A and B. Practicing good hygiene, safe sex, and avoiding sharing needles can help prevent infection.",
    },
    {
      question: "What are the signs of hepatitis?",
      answer:
        "Symptoms may include tiredness, nausea, abdominal pain, dark urine, pale stools, and yellowing of the skin or eyes. Some people have no symptoms at all.",
    },
    {
      question: "How is hepatitis diagnosed?",
      answer:
        "Doctors use blood tests to check for liver enzymes and specific viruses. Imaging and sometimes a liver biopsy may be needed for further evaluation.",
    },
    {
      question: "What treatments are available?",
      answer:
        "Treatment depends on the type of hepatitis. Some require only supportive care, while others may need antiviral medications or ongoing monitoring.",
    },
    {
      question: "Can I live a normal life with hepatitis?",
      answer:
        "Many people with hepatitis can lead healthy lives with proper care, regular checkups, and by following medical advice.",
    },
    {
      question: "Should I tell others about my diagnosis?",
      answer:
        "It is important to inform healthcare providers and those at risk of exposure. Discuss with your doctor about who else should be notified.",
    },
    {
      question: "Where can I find more information?",
      answer:
        "Trusted sources include your healthcare provider, national health organizations, and patient support groups.",
    },
  ];

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/patient-education")}
          sx={{ mb: 3 }}
        >
          Back to Education
        </Button>

        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="300"
            image="/api/placeholder/800/300"
            alt="FAQs About Hepatitis"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PlayCircle sx={{ mr: 1, color: "primary.main" }} />
              <Chip label="Video" color="secondary" variant="outlined" />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              FAQs About Hepatitis
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Answers to important questions about hepatitis and how it affects
              your health.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography paragraph>
            Find clear answers to common concerns about hepatitis. For more
            details, consult your healthcare provider.
          </Typography>

          <Box sx={{ mt: 3 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: "grey.50",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Help sx={{ mr: 2, color: "primary.main" }} />
                    <Typography variant="h6">{faq.question}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Additional Resources
          </Typography>
          <Typography paragraph>
            Explore these organizations for more information:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Centers for Disease Control and Prevention (CDC)
            <br />
            • World Health Organization (WHO)
            <br />
            • American Liver Foundation
            <br />
            • Hepatitis B Foundation
            <br />• Speak with your healthcare provider
          </Typography>
        </Box>

        <Card sx={{ bgcolor: "info.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Remember
            </Typography>
            <Typography>
              Information here is general. Always follow your healthcare
              provider's advice for your specific situation.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default FAQsAboutHepatitis;
