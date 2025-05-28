import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.7;
  }
`;

const shine = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

// Styled components
const NotFoundContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  fontFamily: "Georgia, serif",
  position: "relative",
  overflow: "hidden",
}));

const ErrorContent = styled(Container)(({ theme }) => ({
  textAlign: "center",
  color: "#333333",
  zIndex: 2,
  position: "relative",
  animation: `${fadeInUp} 1s ease-out`,
}));

const ErrorNumber = styled(Typography)(({ theme }) => ({
  fontSize: "8rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  textShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  fontFamily: "Georgia, serif",
  color: "#667eea",
  [theme.breakpoints.down("md")]: {
    fontSize: "5rem",
  },
}));

const NumberSpan = styled("span")(({ delay = 0 }) => ({
  display: "inline-block",
  animation: `${bounce} 2s infinite`,
  animationDelay: `${delay}s`,
}));

const ZeroSpan = styled(NumberSpan)(({ theme }) => ({
  color: "#ff6b6b",
  transform: "scale(1.2)",
}));

const ErrorTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  marginBottom: theme.spacing(2),
  fontWeight: 300,
  letterSpacing: "2px",
  animation: `${slideInLeft} 1s ease-out 0.3s both`,
  fontFamily: "Georgia, serif",
  color: "#333333",
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  maxWidth: "500px",
  lineHeight: 1.6,
  opacity: 0.8,
  animation: `${slideInRight} 1s ease-out 0.6s both`,
  margin: "0 auto",
  marginBottom: theme.spacing(4),
  color: "#666666",
  [theme.breakpoints.down("md")]: {
    fontSize: "1rem",
    padding: "0 20px",
  },
}));

const HomeButton = styled(Button)(({ theme }) => ({
  padding: "12px 30px",
  background: "#667eea",
  border: "2px solid #667eea",
  color: "white",
  borderRadius: "50px",
  fontSize: "1.1rem",
  fontWeight: 500,
  letterSpacing: "1px",
  animation: `${slideInRight} 1s ease-out 0.9s both`,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  textTransform: "none",
  fontFamily: "Georgia, serif",
  "&:hover": {
    background: "#5a67d8",
    color: "white",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    animation: `${shine} 0.5s ease-in-out`,
  },
  [theme.breakpoints.down("md")]: {
    padding: "10px 25px",
    fontSize: "1rem",
  },
}));

const FloatingElements = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});

const FloatingDot = styled(Box)(
  ({ size = 20, top, left, right, bottom, delay = 0 }) => ({
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    background: "rgba(102, 126, 234, 0.2)",
    borderRadius: "50%",
    animation: `${float} 6s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    top,
    left,
    right,
    bottom,
  })
);

function NotFound() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <NotFoundContainer>
      <ErrorContent maxWidth="md">
        <ErrorNumber variant="h1">
          <NumberSpan delay={0}>4</NumberSpan>
          <ZeroSpan delay={0.1}>0</ZeroSpan>
          <NumberSpan delay={0.2}>4</NumberSpan>
        </ErrorNumber>

        <ErrorTitle variant="h2" color="inherit">
          Page Not Found
        </ErrorTitle>

        <ErrorMessage variant="body1" color="inherit">
          Oops! The page you're looking for seems to have wandered off into the
          digital void.
        </ErrorMessage>

        <HomeButton
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<HomeIcon />}
          size="large"
        >
          Return Home
        </HomeButton>
      </ErrorContent>

      <FloatingElements>
        <FloatingDot size={20} top="20%" left="10%" delay={0} />
        <FloatingDot size={15} top="60%" right="20%" delay={2} />
        <FloatingDot size={25} bottom="30%" left="20%" delay={4} />
      </FloatingElements>
    </NotFoundContainer>
  );
}

export default NotFound;
