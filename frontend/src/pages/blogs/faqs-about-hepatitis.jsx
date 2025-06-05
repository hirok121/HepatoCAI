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
      question: "What is the difference between hepatitis A, B, and C?",
      answer:
        "Hepatitis A is typically acute and transmitted through contaminated food/water. Hepatitis B can be acute or chronic and is transmitted through blood and bodily fluids. Hepatitis C is usually chronic and primarily transmitted through blood contact. Vaccines are available for A and B, but not for C.",
    },
    {
      question: "How is hepatitis C transmitted?",
      answer:
        "Hepatitis C is primarily transmitted through blood-to-blood contact. This can happen through sharing needles, unsterilized medical equipment, blood transfusions (before 1992), and rarely through sexual contact or from mother to child during birth.",
    },
    {
      question: "Can hepatitis C be cured?",
      answer:
        "Yes! Modern direct-acting antiviral (DAA) medications can cure hepatitis C in over 95% of cases. Treatment typically lasts 8-12 weeks and has minimal side effects compared to older treatments.",
    },
    {
      question: "Do I need to tell people I have hepatitis?",
      answer:
        "You're not legally required to disclose your hepatitis status in most situations. However, you should inform healthcare providers, sexual partners, and anyone who might be at risk of exposure. Close family members should also be informed for their safety and support.",
    },
    {
      question: "Can I drink alcohol if I have hepatitis?",
      answer:
        "No, alcohol should be completely avoided if you have hepatitis. Alcohol can accelerate liver damage and interfere with treatment effectiveness. Even small amounts can be harmful to an already compromised liver.",
    },
    {
      question: "What symptoms should I watch for?",
      answer:
        "Many people with hepatitis have no symptoms. When symptoms occur, they may include fatigue, abdominal pain, loss of appetite, nausea, dark urine, light-colored stools, and yellowing of skin/eyes (jaundice). Report any new or worsening symptoms to your healthcare provider.",
    },
    {
      question: "How often should I see my doctor?",
      answer:
        "Follow-up frequency depends on your specific situation, but typically every 3-6 months for monitoring. During treatment, visits may be more frequent. Your healthcare provider will determine the appropriate schedule based on your condition and treatment response.",
    },
    {
      question: "Can I have children if I have hepatitis?",
      answer:
        "Yes, people with hepatitis can have children. However, there's a small risk of transmission from mother to child during birth. Work closely with your healthcare team to minimize risks and ensure proper monitoring during pregnancy.",
    },
    {
      question: "Is hepatitis contagious through casual contact?",
      answer:
        "No, hepatitis is not spread through casual contact like hugging, shaking hands, sharing utensils, or being in the same room. Hepatitis A can be spread through contaminated food/water, while B and C require blood or bodily fluid contact.",
    },
    {
      question: "What foods should I avoid?",
      answer:
        "Avoid alcohol completely, limit processed and fried foods, reduce sodium intake, and be cautious with raw or undercooked foods. Focus on a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains.",
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
              Common questions and answers about hepatitis
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography paragraph>
            Here are answers to the most common questions people have about
            hepatitis. If you have additional questions, don't hesitate to ask
            your healthcare provider.
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
            For more detailed information, consider these resources:
          </Typography>
          <Typography component="div" sx={{ ml: 2 }}>
            • Centers for Disease Control and Prevention (CDC)
            <br />
            • World Health Organization (WHO)
            <br />
            • American Liver Foundation
            <br />
            • Hepatitis B Foundation
            <br />• Your healthcare provider and hepatitis specialist
          </Typography>
        </Box>

        <Card sx={{ bgcolor: "info.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Remember
            </Typography>
            <Typography>
              Every person's situation is unique. While these FAQs provide
              general information, always consult with your healthcare provider
              for personalized advice and treatment recommendations.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default FAQsAboutHepatitis;
