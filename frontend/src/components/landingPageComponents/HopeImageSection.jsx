import React from "react";
import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import hopeImage from "../../assets/hope.png";

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

const HopeImageSection = ({ animationDelay = "0.4s" }) => {
  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 40%" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: { xs: "100%", sm: "40%" },
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
          src={hopeImage}
          alt="Hope and solution for HCV treatment"
        />
      </AnimatedBox>
    </Box>
  );
};

export default HopeImageSection;
