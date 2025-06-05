import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
} from "@mui/material";
import { Biotech } from "@mui/icons-material";
import NavBar from "../../components/layout/NavBar";
import hcvSymptomsImg from "../../assets/blogimages/hcv_symptoms.jpg";
import virusHumanImg from "../../assets/blogimages/virushuman.jpg";

function UnderstandingHCV() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="400"
            image={hcvSymptomsImg}
            alt="Understanding Hepatitis C"
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Biotech sx={{ mr: 1, color: "primary.main" }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Understanding Hepatitis C: From Detection to Treatment
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Hepatitis C is a major global health concern, affecting millions
              of people and often progressing without symptoms until advanced
              stages. This article explores the nature of Hepatitis C, the
              transformative role of artificial intelligence in its diagnosis
              and management, and the future of care for those impacted by this
              disease.
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Hepatitis C and Its Progression
          </Typography>
          <Typography paragraph>
            Hepatitis C is a blood-borne virus that primarily attacks the liver.
            Transmission occurs mainly through exposure to infected blood, such
            as through unsafe injections, transfusions, or, less commonly,
            sexual contact. The infection can be acute or chronic, with many
            individuals unaware they are infected until liver damage has
            occurred. Over time, untreated Hepatitis C can lead to progressive
            liver injury.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Types and Stages: Hepatitis, Fibrosis, and Cirrhosis
          </Typography>
          <Typography paragraph>
            The course of Hepatitis C infection can be understood in three main
            stages:
          </Typography>
          <ul style={{ marginLeft: 24 }}>
            <li>
              <b>Hepatitis:</b> The initial stage, where the virus causes
              inflammation of the liver. Many people have no symptoms, but some
              may experience fatigue, mild abdominal pain, or jaundice. This
              stage can be acute (short-term) or progress to chronic infection.
            </li>
            <li>
              <b>Fibrosis:</b> Persistent inflammation leads to the formation of
              scar tissue (fibrosis) in the liver. The liver still functions,
              but the scarring is a sign of ongoing damage. Fibrosis can be
              detected with specialized blood tests or imaging.
            </li>
            <li>
              <b>Cirrhosis:</b> Extensive scarring disrupts the liver’s
              structure and function. Cirrhosis is a serious, often irreversible
              condition that can result in liver failure, internal bleeding, and
              increased risk of liver cancer. Symptoms may include swelling,
              confusion, and severe fatigue.
            </li>
          </ul>
          <Typography paragraph>
            Understanding these stages is crucial for guiding treatment and
            monitoring disease progression. Early intervention can prevent the
            transition from hepatitis to fibrosis and cirrhosis.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Symptoms
          </Typography>
          <Typography paragraph>
            Most people with acute Hepatitis C infection do not experience
            symptoms, which is why the disease is often called a
            &quot;silent&quot; infection. When symptoms do occur, they may
            include:
          </Typography>
          <ul style={{ marginLeft: 24 }}>
            <li>Fatigue and weakness</li>
            <li>Loss of appetite</li>
            <li>Nausea or vomiting</li>
            <li>Jaundice (yellowing of the skin and eyes)</li>
            <li>Dark urine</li>
            <li>Abdominal pain, especially in the upper right side</li>
            <li>Joint and muscle pain</li>
          </ul>
          <Typography paragraph>
            Chronic infection can remain asymptomatic for years, but over time,
            it can lead to serious liver damage, cirrhosis, and liver cancer.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Diagnosis: Traditional Methods and the Role of AI
          </Typography>
          <Typography paragraph>
            <b>Traditional Diagnosis:</b> Hepatitis C is typically diagnosed
            through blood tests that detect antibodies to HCV, followed by
            confirmatory tests for viral RNA to determine active infection.
            Additional tests, such as liver function panels and imaging, help
            assess the extent of liver damage. However, these methods may not
            always identify early or asymptomatic cases, and interpretation can
            be complex in patients with coexisting conditions.
          </Typography>
          <Typography paragraph>
            <b>AI-Enhanced Diagnosis:</b> Artificial intelligence is
            transforming HCV diagnosis by integrating and analyzing large
            datasets from laboratory results, imaging, and patient histories. AI
            algorithms can identify subtle patterns and risk factors, flagging
            high-risk individuals who might otherwise be missed. This leads to
            earlier detection, more accurate staging of liver disease, and
            better prediction of treatment response, ultimately improving
            patient outcomes.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Treatment
          </Typography>
          <Typography paragraph>
            The treatment of Hepatitis C has advanced dramatically in recent
            years. Direct-acting antiviral (DAA) medications now offer cure
            rates above 95% for most patients, with shorter treatment durations
            and fewer side effects than older therapies. The choice of regimen
            depends on the HCV genotype, presence of liver damage, and other
            health factors. Early treatment is key to preventing complications
            such as cirrhosis and liver cancer. Ongoing research, including
            AI-driven approaches, is helping to further personalize therapy and
            monitor for relapse or reinfection.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            The Evolution of Diagnosis: Enter Artificial Intelligence
          </Typography>
          <Typography paragraph>
            Artificial intelligence (AI) is revolutionizing the way Hepatitis C
            is detected and managed. By leveraging machine learning algorithms,
            AI systems can analyze vast amounts of clinical, laboratory, and
            imaging data to identify patterns that may be invisible to the human
            eye. These tools can flag high-risk individuals, predict disease
            progression, and even suggest optimal treatment strategies based on
            individual patient profiles.
          </Typography>
          <Paper sx={{ p: 3, my: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom color="primary">
              Key Advantages of AI in Hepatitis C Care
            </Typography>
            <Typography component="div">
              • Rapid analysis of complex datasets for early detection
              <br />• Enhanced accuracy in identifying at-risk patients
              <br />• Support for clinicians in making evidence-based decisions
              <br />• Continuous learning from new data to improve future
              outcomes
              <br />• Potential to reduce healthcare disparities by enabling
              remote and automated screening
            </Typography>
          </Paper>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Impact on Patients and Healthcare Systems
          </Typography>
          <Typography paragraph>
            For patients, AI-driven diagnostics mean earlier intervention, less
            invasive testing, and a greater chance of achieving a cure with
            modern antiviral therapies. Healthcare providers benefit from
            improved workflow efficiency, reduced diagnostic errors, and the
            ability to focus resources on those most in need. In
            resource-limited settings, AI can help bridge gaps in expertise and
            access, bringing advanced care to underserved populations.
          </Typography>
          <Box sx={{ my: 3, textAlign: "center" }}>
            <CardMedia
              component="img"
              height="300"
              image={virusHumanImg}
              alt="Hepatitis C virus and human interaction"
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: "100%",
                mx: "auto",
                display: "block",
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Visualizing the impact of Hepatitis C on human health
            </Typography>
          </Box>
          <Typography paragraph>
            The integration of AI into Hepatitis C care is not just about
            technology—it is about empowering patients, supporting clinicians,
            and ultimately saving lives. By catching the disease earlier and
            guiding personalized treatment, AI is helping to turn the tide
            against a once-daunting public health challenge.
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Challenges and the Road Ahead
          </Typography>
          <Typography paragraph>
            Despite its promise, the adoption of AI in Hepatitis C care faces
            challenges. Data privacy, algorithm transparency, and the need for
            robust clinical validation are ongoing concerns. Additionally,
            integrating AI tools into existing healthcare systems requires
            training, infrastructure, and collaboration between technologists
            and medical professionals.
          </Typography>
          <Typography paragraph>
            Nevertheless, research and pilot programs worldwide are
            demonstrating the value of AI in real-world settings. As these
            technologies mature, they are expected to become standard components
            of Hepatitis C screening, monitoring, and management.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            The Future: Toward Elimination of Hepatitis C
          </Typography>
          <Typography paragraph>
            The World Health Organization has set ambitious goals to eliminate
            Hepatitis C as a public health threat. AI-powered innovations are
            poised to play a central role in achieving these targets by making
            screening more accessible, improving linkage to care, and optimizing
            treatment outcomes. With continued investment and collaboration, the
            vision of a world free from Hepatitis C is within reach.
          </Typography>
          {/* YouTube Video Section */}
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Understanding Hepatitis C: Comprehensive Overview
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
                src="https://www.youtube.com/embed/eocRM7MhF68"
                title="Understanding Hepatitis C: Comprehensive Overview"
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
              Educational video providing comprehensive information about
              Hepatitis C virus, detection, and management
            </Typography>
          </Box>
        </Box>
        <Card sx={{ bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transforming Lives Through Innovation
            </Typography>
            <Typography>
              The integration of AI into Hepatitis C care is not just a
              technological leap—it&apos;s a step toward a healthier, more
              hopeful future for individuals and communities worldwide.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default UnderstandingHCV;
