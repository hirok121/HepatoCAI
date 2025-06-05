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
} from "@mui/material";
import { ArrowBack, Article } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";

function UnderstandingHepatitisTypes() {
  const navigate = useNavigate();

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
            alt="Understanding Hepatitis Types"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Article sx={{ mr: 1, color: "primary.main" }} />
              <Chip label="Article" color="primary" variant="outlined" />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Understanding Hepatitis Types
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Learn about different types of hepatitis and their characteristics
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            What is Hepatitis?
          </Typography>
          <Typography paragraph>
            Hepatitis is inflammation of the liver. It can be caused by viruses,
            alcohol, toxins, medications, and certain medical conditions.
            Understanding the different types is crucial for proper treatment
            and prevention.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Hepatitis A (HAV)
          </Typography>
          <Typography paragraph>
            Hepatitis A is a viral infection that causes liver inflammation and
            damage. It's usually transmitted through contaminated food or water,
            or close contact with an infected person. It's typically acute and
            doesn't cause chronic infection.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Hepatitis B (HBV)
          </Typography>
          <Typography paragraph>
            Hepatitis B is a serious liver infection caused by the hepatitis B
            virus. It can be acute or chronic. Chronic hepatitis B can lead to
            liver cirrhosis, liver failure, or liver cancer if left untreated.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Hepatitis C (HCV)
          </Typography>
          <Typography paragraph>
            Hepatitis C is a viral infection that causes liver inflammation.
            It's primarily spread through blood contact. Many people with
            hepatitis C don't have symptoms until liver damage occurs, which can
            take years or decades.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Key Differences
          </Typography>
          <Typography paragraph>
            • <strong>Transmission:</strong> A and E are usually foodborne, B
            and D are bloodborne and sexually transmitted, C is primarily
            bloodborne
          </Typography>
          <Typography paragraph>
            • <strong>Chronicity:</strong> A and E are typically acute, B, C,
            and D can become chronic
          </Typography>
          <Typography paragraph>
            • <strong>Prevention:</strong> Vaccines are available for A and B,
            but not for C
          </Typography>
        </Box>

        <Card sx={{ bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Important Note
            </Typography>
            <Typography>
              If you suspect you may have been exposed to hepatitis or are
              experiencing symptoms, consult with a healthcare provider
              immediately for proper testing and treatment options.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default UnderstandingHepatitisTypes;
