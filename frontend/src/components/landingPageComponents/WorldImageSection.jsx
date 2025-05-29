import React from "react";
import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import wordImage from "../../assets/world.png";

// Animations
const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)(({ animationDelay = "0s" }) => ({
  animation: `${fadeInAnimation} 0.8s ease-out ${animationDelay} both`,
}));

const ProblemImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: "12px",
  boxShadow: theme.shadows[3],
  objectFit: "cover",
  maxHeight: "450px",
  "@media (max-width: 600px)": {
    maxHeight: "300px",
  },
}));

const WorldImageSection = ({ animationDelay = "0.2s" }) => {
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedBox
        animationDelay={animationDelay}
        sx={{
          width: "100%",
          maxWidth: {
            xs: "380px",
            sm: "350px",
            md: "400px",
            lg: "450px",
          },
        }}
      >
        <ProblemImage
          src={wordImage}
          alt="HCV global health challenge statistics and impact"
        />
      </AnimatedBox>
    </Box>
  );
};

export default WorldImageSection;
