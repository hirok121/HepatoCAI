// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Analytics,
  NavigateNext,
  NavigateBefore,
  Refresh,
} from "@mui/icons-material";
import api from "../../services/api";

// Import components
import DiagnosisHero from "../../components/diagnosis/DiagnosisHero";
import PatientInfoStep from "../../components/forms/PatientInfoStep";
import LabResultsStep from "../../components/forms/LabResultsStep";
import AdditionalDataStep from "../../components/forms/AdditionalDataStep";
import MedicalDisclaimer from "../../components/diagnosis/MedicalDisclaimer";
import DiagnosisResults from "../../components/diagnosis/DiagnosisResults";
import NavBar from "../../components/layout/NavBar";

function Diagnosis() {
  const [activeStep, setActiveStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    sex: "",
    alp: "",
    ast: "",
    che: "",
    crea: "",
    cgt: "",
    alb: "",
    bil: "",
    chol: "",
    prot: "",
    alt: "",
    symptoms: [],
  });

  const steps = [
    "Patient Information",
    "Required Lab Results",
    "Additional Data & Analysis",
  ];

  const handleSymptomToggle = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const step1Required = ["patientName", "age", "sex"];
      const missing = step1Required.filter((field) => !formData[field]);
      if (missing.length > 0) {
        alert(`Please fill in: ${missing.join(", ")}`);
        return;
      }
    } else if (activeStep === 1) {
      const step2Required = ["alp", "ast", "che", "crea", "cgt"];
      const missing = step2Required.filter((field) => !formData[field]);
      if (missing.length > 0) {
        alert(`Please fill in required lab results: ${missing.join(", ")}`);
        return;
      }
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsSubmitted(true); // Mark as submitted to hide form

    try {
      // For now, simulate API call with dummy data
      // Replace this with actual API call: const response = await api.post('/api/analyze-hcv/', formData);
      // Replace the dummy data section with:
      const response = await api.post("/diagnosis/analyze-hcv/", {
        patient_name: formData.patientName,
        age: formData.age,
        sex: formData.sex,
        alp: formData.alp,
        ast: formData.ast,
        che: formData.che,
        crea: formData.crea,
        cgt: formData.cgt,
        alb: formData.alb || null,
        bil: formData.bil || null,
        chol: formData.chol || null,
        prot: formData.prot || null,
        alt: formData.alt || null,
        symptoms: formData.symptoms,
      });

      // For debugging purposes, you can log the response and form data
      // console.log("Analysis results:", response.data);
      // console.log("Form data submitted:", formData);
      // console.log("Full API Response:", response.data); // Add this for debugging

      // Extract the diagnosis_result from the correct nested structure
      setAnalysisResults(response.data.data);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = () => {
    // Reset the form to allow new submission
    setIsSubmitted(false);
    setAnalysisResults(null);
    setActiveStep(0);
    setFormData({
      patientName: "",
      age: "",
      sex: "",
      alp: "",
      ast: "",
      che: "",
      crea: "",
      cgt: "",
      alb: "",
      bil: "",
      chol: "",
      prot: "",
      alt: "",
      symptoms: [],
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PatientInfoStep formData={formData} handleChange={handleChange} />
        );
      case 1:
        return (
          <LabResultsStep formData={formData} handleChange={handleChange} />
        );
      case 2:
        return (
          <AdditionalDataStep
            formData={formData}
            handleChange={handleChange}
            handleSymptomToggle={handleSymptomToggle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F0F4F8", minHeight: "100vh" }}>
      {/* Navbar */}
      <NavBar />
      {/* Hero Section */}
      <DiagnosisHero />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Only show stepper and form if not submitted */}
        {!isSubmitted && (
          <>
            {/* Progress Stepper */}
            <Paper
              sx={{ p: 4, mb: 4, borderRadius: 3, border: "1px solid #E2E8F0" }}
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          fontWeight: activeStep === index ? 600 : 400,
                          fontSize: "1rem",
                          color: "#1E293B",
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Main Form */}
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                minHeight: 500,
              }}
            >
              <Box sx={{ py: 2 }}>{renderStepContent(activeStep)}</Box>

              {/* Navigation Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 6,
                  pt: 4,
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<NavigateBefore />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    color: "#475569",
                  }}
                >
                  Back
                </Button>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {steps.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor:
                          index <= activeStep ? "#2563EB" : "#CBD5E1",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<Analytics />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: 2,
                      backgroundColor: "#2563EB",
                      "&:hover": {
                        backgroundColor: "#1D4ED8",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Analyze with AI
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<NavigateNext />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: 2,
                      backgroundColor: "#2563EB",
                      "&:hover": {
                        backgroundColor: "#1D4ED8",
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Paper>
          </>
        )}
        {/* Analysis Results */}
        {(loading || analysisResults) && (
          <DiagnosisResults results={analysisResults} loading={loading} />
        )}{" "}
        {/* Resubmit Button - Show only when analysis is complete */}
        {isSubmitted && !loading && analysisResults && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleResubmit}
              startIcon={<Refresh />}
              sx={{
                px: 8,
                py: 2.5,
                fontSize: "1.2rem",
                fontWeight: 600,
                borderRadius: 5,
                backgroundColor: "#059669",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#047857",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(5, 150, 105, 0.4)",
                },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 6px 20px rgba(5, 150, 105, 0.3)",
                border: "2px solid transparent",
                "&:focus": {
                  outline: "none",
                  borderColor: "#10B981",
                  boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
                },
              }}
            >
              Analyze Another Patient
            </Button>
          </Box>
        )}
        {/* Medical Disclaimer */}
        <MedicalDisclaimer />
      </Container>
    </Box>
  );
}

export default Diagnosis;
