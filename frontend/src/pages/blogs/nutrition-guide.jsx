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
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  MenuBook,
  Restaurant,
  LocalDrink,
  Healing,
  Warning,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";

function NutritionGuide() {
  const navigate = useNavigate();

  const nutritionTips = [
    {
      category: "Foods to Include",
      icon: <Restaurant color="success" />,
      items: [
        "Lean proteins (fish, poultry, legumes)",
        "Fresh fruits and vegetables",
        "Whole grains",
        "Healthy fats (olive oil, avocados, nuts)",
      ],
    },
    {
      category: "Foods to Limit",
      icon: <Warning color="warning" />,
      items: [
        "Processed and fried foods",
        "High sodium foods",
        "Refined sugars",
        "Saturated fats",
      ],
    },
    {
      category: "Hydration",
      icon: <LocalDrink color="primary" />,
      items: [
        "Drink plenty of water",
        "Herbal teas are beneficial",
        "Avoid alcohol completely",
        "Limit caffeine intake",
      ],
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
            alt="Nutrition Guide"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MenuBook sx={{ mr: 1, color: "primary.main" }} />
              <Chip label="Guide" color="success" variant="outlined" />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Nutrition Guide
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Dietary recommendations for hepatitis patients
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Nutrition for Liver Health
          </Typography>
          <Typography paragraph>
            Proper nutrition plays a crucial role in supporting liver function
            and overall health for people with hepatitis. A well-balanced diet
            can help your liver heal and reduce inflammation.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Dietary Guidelines
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {nutritionTips.map((tip, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {tip.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {tip.category}
                    </Typography>
                  </Box>
                  {tip.items.map((item, itemIndex) => (
                    <Typography key={itemIndex} variant="body2" sx={{ mb: 1 }}>
                      • {item}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Sample Daily Meal Plan
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Breakfast
            </Typography>
            <Typography paragraph>
              • Oatmeal with fresh berries and chopped walnuts
              <br />
              • Green tea or herbal tea
              <br />• Small glass of freshly squeezed orange juice
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Lunch
            </Typography>
            <Typography paragraph>
              • Grilled salmon with quinoa
              <br />
              • Mixed green salad with olive oil dressing
              <br />
              • Steamed broccoli
              <br />• Water with lemon
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Dinner
            </Typography>
            <Typography paragraph>
              • Lean chicken breast with brown rice
              <br />
              • Roasted vegetables (carrots, bell peppers, zucchini)
              <br />
              • Small portion of avocado
              <br />• Herbal tea
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Snacks
            </Typography>
            <Typography>
              • Fresh fruit
              <br />
              • Handful of unsalted nuts
              <br />• Greek yogurt with honey
            </Typography>
          </Paper>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Special Considerations
          </Typography>
          <Typography paragraph>
            <strong>Iron Management:</strong> Some people with hepatitis may
            have excess iron. Discuss iron supplements and iron-rich foods with
            your healthcare provider.
          </Typography>
          <Typography paragraph>
            <strong>Vitamin D:</strong> Many people with liver disease are
            deficient in vitamin D. Consider supplementation under medical
            supervision.
          </Typography>
          <Typography paragraph>
            <strong>Salt Restriction:</strong> If you have fluid retention or
            high blood pressure, you may need to limit sodium intake further.
          </Typography>

          {/* YouTube Video Section */}
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Nutrition and Liver Health Video Guide
            </Typography>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%" /* 16:9 aspect ratio */,
                height: 0,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: "100%",
                mx: "auto",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/Ns8SHmyVMwU?start=60"
                title="Nutrition and Liver Health Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Educational video about nutrition guidelines for liver health and
              hepatitis management
            </Typography>
          </Box>
        </Box>

        <Card sx={{ bgcolor: "success.light", color: "white" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Healing sx={{ mr: 1 }} />
              <Typography variant="h6">Nutrition Consultation</Typography>
            </Box>
            <Typography>
              Consider working with a registered dietitian who specializes in
              liver disease to create a personalized nutrition plan that meets
              your specific needs.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default NutritionGuide;
