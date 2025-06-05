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
        "Lean meats, fish, and plant-based proteins",
        "A variety of colorful fruits and vegetables",
        "Whole grains like brown rice and oats",
        "Healthy fats such as olive oil and nuts",
      ],
    },
    {
      category: "Foods to Limit",
      icon: <Warning color="warning" />,
      items: [
        "Fried and processed foods",
        "Salty snacks and canned foods",
        "Sugary drinks and desserts",
        "Foods high in saturated fat",
      ],
    },
    {
      category: "Hydration",
      icon: <LocalDrink color="primary" />,
      items: [
        "Drink water throughout the day",
        "Choose herbal teas for variety",
        "Avoid alcohol completely",
        "Limit drinks with caffeine",
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
              Tips for healthy eating with hepatitis.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Eating for Liver Health
          </Typography>
          <Typography paragraph>
            Good nutrition supports your liver and helps your body fight
            infection. A balanced diet can reduce inflammation and help you feel
            your best.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Nutrition Tips
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
            Example Meal Plan
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Breakfast
            </Typography>
            <Typography paragraph>
              • Whole grain toast with nut butter
              <br />• Fresh fruit salad
              <br />• Herbal tea
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Lunch
            </Typography>
            <Typography paragraph>
              • Grilled chicken or tofu with quinoa
              <br />• Steamed vegetables
              <br />• Mixed greens with olive oil
              <br />• Water
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Dinner
            </Typography>
            <Typography paragraph>
              • Baked fish or beans with brown rice
              <br />• Roasted vegetables
              <br />• Sliced avocado
              <br />• Herbal tea
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="primary">
              Snacks
            </Typography>
            <Typography>
              • Fresh fruit
              <br />• Unsalted nuts
              <br />• Low-fat yogurt
            </Typography>
          </Paper>

          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Special Tips
          </Typography>
          <Typography paragraph>
            <strong>Iron:</strong> Some people with hepatitis need to limit
            iron. Ask your doctor before taking supplements.
          </Typography>
          <Typography paragraph>
            <strong>Vitamin D:</strong> If you have low vitamin D, your provider
            may recommend supplements.
          </Typography>
          <Typography paragraph>
            <strong>Salt:</strong> If you have swelling or high blood pressure,
            reduce salt in your diet.
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
              Watch this video for more nutrition tips for hepatitis
            </Typography>
          </Box>
        </Box>

        <Card sx={{ bgcolor: "success.light", color: "white" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Healing sx={{ mr: 1 }} />
              <Typography variant="h6">Nutrition Support</Typography>
            </Box>
            <Typography>
              A registered dietitian can help you create a meal plan that fits
              your needs and supports your liver health.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default NutritionGuide;
