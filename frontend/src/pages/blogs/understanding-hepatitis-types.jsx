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
              A guide to the main types of hepatitis and what makes each unique.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            What is Hepatitis?
          </Typography>
          <Typography paragraph>
            Hepatitis is a condition where the liver becomes inflamed. This can
            be caused by viruses, alcohol, certain medications, or other health
            problems. The liver is vital for filtering toxins and supporting
            digestion, so keeping it healthy is important.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Hepatitis A (HAV)
          </Typography>
          <Typography paragraph>
            Hepatitis A is a short-term infection spread mainly through
            contaminated food or water. It usually resolves on its own and does
            not cause long-term liver problems.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Hepatitis B (HBV)
          </Typography>
          <Typography paragraph>
            Hepatitis B can be both short-term and long-term. It spreads through
            blood, sexual contact, or from mother to baby. Chronic hepatitis B
            can lead to serious liver issues if not managed.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Hepatitis C (HCV)
          </Typography>
          <Typography paragraph>
            Hepatitis C is mainly spread through blood. Many people do not
            notice symptoms until the liver is already damaged. With new
            treatments, most people can be cured.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Comparing the Types
          </Typography>
          <Typography paragraph>
            • <strong>How they spread:</strong> A is foodborne, B and C are
            bloodborne, B can also be sexually transmitted
          </Typography>
          <Typography paragraph>
            • <strong>Chronic vs. Acute:</strong> A is always short-term, B and
            C can become long-term
          </Typography>
          <Typography paragraph>
            • <strong>Prevention:</strong> Vaccines are available for A and B,
            but not for C
          </Typography>
        </Box>

        <Card sx={{ bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Take Action
            </Typography>
            <Typography>
              If you think you may have been exposed to hepatitis, see a
              healthcare provider for testing and advice. Early detection makes
              a big difference.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default UnderstandingHepatitisTypes;
