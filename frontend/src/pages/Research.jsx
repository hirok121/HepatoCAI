import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Card,
  CardContent,
  Alert,
  Divider,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DiagnosisIcon from "@mui/icons-material/Biotech";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScienceIcon from "@mui/icons-material/Science";
import NavBar from "../components/layout/NavBar";

function Research() {
  const researchPapers = [
    {
      title: "Hepatitis C Virus Infection",
      authors: "Georg M. Lauer, M.D., and Bruce D. Walker, M.D.",
      journal: "The New England Journal of Medicine",
      year: "2001",
      abstract:
        "Hepatitis C virus (HCV) infects an estimated 170 million persons worldwide and thus represents a viral pandemic, one that is five times as widespread as infection with the human immunodeficiency virus type 1 (HIV-1). The institution of blood-screening measures in developed countries has decreased the risk of transfusion-associated hepatitis to a negligible level, but new cases continue to occur mainly as a result of injection-drug use and, to a lesser degree, through other means of percutaneous or mucous-membrane exposure. Progression to chronic disease occurs in the majority of HCV-infected persons, and infection with the virus has become the main indication for liver transplantation. HCV infection also increases the number of complications in persons who are coinfected with HIV-1. Although research advances have been impeded by the inability to grow HCV easily in culture, there have been new insights into pathogenesis of the infection and improvements in treatment options.",
      tags: ["Hepatitis C", "Epidemiology", "Treatment", "Review"],
      link: "https://www.nejm.org/doi/full/10.1056/NEJM200107053450107",
    },
    {
      title: "Hepatitis C virus: Virology, diagnosis and treatment",
      authors: "Hui-Chun Li, Shih-Yen Lo",
      journal: "World J Hepatol",
      year: "2015",
      abstract:
        "More than twenty years of study has provided a better understanding of hepatitis C virus (HCV) life cycle, including the general properties of viral RNA and proteins. This effort facilitates the development of sensitive diagnostic tools and effective antiviral treatments. At present, serologic screening test is recommended to perform on individuals in the high risk groups and nucleic acid tests are recommended to confirm the active HCV infections. Quantization and genotyping of HCV RNAs are important to determine the optimal duration of anti-viral therapy and predict the likelihood of response. In the early 2000s, pegylated interferon plus ribavirin became the standard anti-HCV treatment. However, this therapy is not ideal. To 2014, boceprevir, telaprevir, simeprevir, sofosbuvir and Harvoni are approved by Food and Drug Administration for the treat of HCV infections. It is likely that the new all-oral, interferon-free, pan-genotyping anti-HCV therapy will be available within the next few years. Majority of HCV infections will be cured by these anti-viral treatments. However, not all patients are expected to be cured due to viral resistance and the high cost of antiviral treatments. Thus, an efficient prophylactic vaccine will be the next challenge in the fight against HCV infection.",
      tags: [
        "Hepatitis C virus",
        "Diagnosis",
        "Treatment",
        "Hepatocellular carcinoma",
        "Nucleic acid test",
        "Enzyme immunoassay",
        "Interferon",
        "Direct acting antivirals",
        "Host-targeted agents",
        "Sofosbuvir",
      ],
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4450201/",
    },
    {
      title: "The hepatitis C virus: Overview",
      authors: "Purcell, R",
      journal: "Hepatology",
      year: "1997",
      abstract:
        "Our knowledge of hepatitis C virus (HCV) dates only from 1975, when non- A, non-B hepatitis was first recognized. It was not until 1989 that the genome of the virus was first cloned and sequenced, and expressed viral antigens used to develop serological assays for screening and diagnosis. HCV is in a separate genus of the virus family Flaviviridae. It is a spherical enveloped virus of approximately 50 nm in diameter. Its genome is a single-stranded linear RNA molecule of positive sense and consists of a 5′ noncoding region, a single large open reading frame, and a 3′ noncoding region. The open reading frame encodes at least three structural and six nonstructural proteins. The genome is characterized by significant genetic heterogeneity, based on which HCV isolates can be classified into six major genotypes and more than 50 subtypes. Even individual isolates of HCV are genetically heterogeneous (quasispecies diversity). Genetic heterogeneity of HCV is greatest in the amino-terminal end of the second envelope protein (hypervariable region 1). This region may represent a neutralization epitope that is under selective pressure from the host's humoral immune response. Infection with HCV proceeds to chronicity in more than 80% of cases, and even recovery does not protect against subsequent re-exposure to the virus. The development of a broadly protective vaccine against HCV will therefore require a better understanding of the molecular biology and immune response to this virus.",
      tags: [
        "Hepatitis C",
        "Virology",
        "Genetics",
        "Vaccine",
        "Flaviviridae",
        "Chronic infection",
      ],
      link: "https://journals.lww.com/hep/abstract/1997/12003/The_hepatitis_C_virus__Overview.2.aspx",
    },
    {
      title:
        "Finding undiagnosed patients with hepatitis C infection: an application of artificial intelligence to patient claims data",
      authors: "Orla M. Doyle, Nadejda Leavitt & John A. Rigg",
      journal: "Scientific Reports",
      year: "2020",
      abstract:
        "Hepatitis C virus (HCV) remains a significant public health challenge with approximately half of the infected population untreated and undiagnosed. In this retrospective study, predictive models were developed to identify undiagnosed HCV patients using longitudinal medical claims linked to prescription data from approximately ten million patients in the United States (US) between 2010 and 2016. Features capturing information on demographics, risk factors, symptoms, treatments and procedures relevant to HCV were extracted from patients’ medical history. Predictive algorithms were developed based on logistic regression, random forests, gradient boosted trees and a stacked ensemble. Descriptive analysis indicated that patients exhibited known symptoms of HCV on average 2–3 years prior to their diagnosis. The precision was at least 95% for all algorithms at low levels of recall (10%). For recall levels >50%, the stacked ensemble performed best with a precision of 97% compared with 87% for the gradient boosted trees and just 31% for the logistic regression. For context, the Center for Disease Control recommends screening in an at-risk sub-population with an estimated HCV prevalence of 2.23%. The artificial intelligence (AI) algorithm presented here has a precision which is substantially higher than the screening rates associated with recommended clinical guidelines, suggesting that AI algorithms have the potential to provide a step change in the effectiveness of HCV screening.",
      tags: [
        "Hepatitis C",
        "Artificial Intelligence",
        "Screening",
        "Predictive Models",
        "Claims Data",
        "Machine Learning",
      ],
      link: "https://www.nature.com/articles/s41598-020-67013-6",
    },
    {
      title: "Diagnosis of hepatitis C",
      authors: "Lok, A S; Gunaratnam, N T",
      journal: "Hepatology",
      year: "1997",
      abstract:
        "Currently, the second- and third-generation enzyme immunoassays (EIA-2 and EIA-3) for hepatitis C virus antibody (anti-HCV) are the most practical screening tests for the diagnosis of HCV infection. The need for and the choice of supplementary or confirmatory tests depend on the clinical setting and the likelihood of a true-positive EIA result. Detection of HCV RNA in serum by polymerase chain reaction (PCR) assay is the gold standard for the diagnosis of HCV infection. However, the lack of uniformity in current PCR assays has tarnished this standard. Confirmatory tests for the diagnosis of HCV infection are in general unnecessary in anti-HCV-positive patients who present with chronic liver disease. When indicated, the most appropriate test in this setting is a qualitative PCR assay for HCV RNA. Confirmatory tests should always be performed in anti-HCV-positive blood donors and individuals with normal aminotransferase levels. The most appropriate approach is to retest for anti-HCV using recombinant immunoblot assay (RIBA) and then test for HCV RNA using PCR assay in those who are RIBA positive or indeterminate. Liver histology is the gold standard in assessing severity of liver disease. Quantitative tests for serum HCV RNA levels do not help to determine the severity of liver disease. At the moment, HCV genotyping should be considered a research tool and not a part of the diagnostic work-up in clinical practice. The goals of treatment for chronic hepatitis C are sustained biochemical and virological response. Viral clearance should be determined by qualitative PCR assay. Quantifying serum HCV RNA level can help in predicting response to interferon treatment, but further studies using more standardized assays are needed to determine if these values can be used to select patients for treatment.",
      tags: [
        "Hepatitis C",
        "Diagnosis",
        "EIA",
        "PCR",
        "Liver Disease",
        "Genotyping",
        "Treatment",
      ],
      link: "https://journals.lww.com/hep/abstract/1997/12003/diagnosis_of_hepatitis_c.9.aspx",
    },
    {
      title:
        "Molecular Diagnostics of Hepatitis C Virus Infection: A Systematic Review",
      authors: "John D. Scott, MD, MSc; David R. Gretch, MD, PhD",
      journal: "JAMA",
      year: "2007",
      abstract:
        "Context: Hepatitis C virus (HCV) is a common blood-borne pathogen that relies heavily on nucleic acid testing for confirmation of infection. Nucleic acid tests are invaluable for the diagnosis of HCV infection and provide critical prognostic information for guiding treatment and measuring the response to antiviral therapy. Objective: To review the currently available molecular diagnostic tests for HCV, their clinical applications, and how these tests shed light on the natural history of HCV.",
      tags: [
        "Hepatitis C",
        "Molecular Diagnostics",
        "Nucleic Acid Testing",
        "Diagnosis",
        "Systematic Review",
      ],
      link: "https://jamanetwork.com/journals/jama/fullarticle/205592",
    },
    {
      title: "Properties and classification of hepatitis A virus",
      authors: "Joseph L. Melnick",
      journal: "Division of Molecular Virology, Baylor College of Medicine",
      year: "2002",
      abstract:
        "Hepatitis A virus (HAV) is a member of the picornavirus family. It was first provisionally classified as enterovirus 72, but subsequent determinations of its nucleotide and amino acid sequences showed them to be sufficiently distinct to assign the virus to a new genus. Heparnavirus (Hep-A-RNA-virus) has been suggested as the genus name. HAV shares the key properties of the picornavirus family: an icosahedral particle 28 nm in diameter with cubic symmetry, composed of 30% RNA and 70% protein. The genome is single-stranded 7.48 kb RNA, linear and positive-sense. Like other picornaviruses, HAV possesses four major polypeptides cleaved from a large precursor polyprotein. The surface proteins VPI and VP3 are major antibody-binding sites. The internal protein VP4 is much smaller than the VP4s of other picornaviruses. As other picornaviruses. HAV has no envelope and replicates in the cytoplasm. HAV is stable to treatment with ether and acid, and is much more heat-resistant than other picornaviruses. It withstands 60°C for 1 h. MgCl2 stabilizes the virus to withstand temperatures up to 80°C. The relative resistance of HAV to disinfection indicates a need for extra precautions in dealing with hepatitis patients and their products. Only one serotype is known. There is no antigenic cross-reactivity with other hepatitis viruses. HAV initially was identified in stool and liver preparations by employing immune electron microscopy as the detection system. Chimpanzees and marmoset monkeys are susceptible to HAV. HAV has been cultivated serially in primary explant cultures of adult marmoset livers and in cell lines of primate origin. The infection is usually non-cytopathic and is identified by immunologic assay for virus or its antigen, or by a hybridization assay for viral RNA.",
      tags: [
        "Hepatitis A",
        "Picornavirus",
        "Virology",
        "Classification",
        "Serotype",
        "Stability",
        "Cultivation",
      ],
      link: "https://www.sciencedirect.com/science/article/abs/pii/0264410X9290536S",
    },
  ];
  const ongoingStudies = [
    "Long-term effects of new hepatitis treatments",
    "AI prediction models for hepatitis progression",
    "Genetic factors in hepatitis susceptibility",
    "Community-based hepatitis prevention programs",
    "HepatoCAI diagnostic accuracy validation study",
    "Machine learning algorithms for liver function assessment",
  ];

  const researchStats = [
    {
      title: "Active Research Projects",
      value: "15+",
      icon: <ScienceIcon />,
      description: "Ongoing studies in hepatitis care",
    },
    {
      title: "AI Diagnostic Accuracy",
      value: "96.7%",
      icon: <TrendingUpIcon />,
      description: "Current HepatoCAI model performance",
    },
    {
      title: "Papers Added",
      value: "8",
      icon: <LibraryBooksIcon />,
      description: "Recent publications in our database",
    },
  ];
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {" "}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LibraryBooksIcon
              sx={{ fontSize: "4rem", color: "#2563EB", mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Research Hub
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Latest research findings and ongoing studies in hepatitis care
            </Typography>
            <Alert
              severity="info"
              sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}
            >
              Our AI-powered tools are backed by extensive research and
              continuous validation studies
            </Alert>
          </Box>{" "}
          {/* Research Statistics */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
              {researchStats.map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{ textAlign: "center", p: 2, borderRadius: "16px" }}
                  >
                    <CardContent>
                      <Box sx={{ color: "#2563EB", mb: 1 }}>{stat.icon}</Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#2563EB" }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={4}>
            {/* Research Papers */}
            <Grid item xs={12} lg={8}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Recent Publications
              </Typography>
              {researchPapers.map((paper, index) => (
                <Paper key={index} sx={{ p: 3, mb: 3, borderRadius: "16px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {paper.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {paper.authors} • {paper.journal} • {paper.year}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {paper.abstract}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {paper.tags.map((tag, tagIndex) => (
                      <Chip key={tagIndex} label={tag} size="small" />
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    size="small"
                    sx={{
                      borderColor: "#2563EB",
                      color: "#2563EB",
                      "&:hover": {
                        backgroundColor: "#2563EB",
                        color: "white",
                      },
                    }}
                    {...(paper.link
                      ? {
                          component: "a",
                          href: paper.link,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                  >
                    Read Full Paper
                  </Button>
                </Paper>
              ))}
            </Grid>{" "}
            {/* Ongoing Studies */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: "16px", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Ongoing Studies
                </Typography>
                <List>
                  {ongoingStudies.map((study, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={study}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Research Collaboration
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Our AI models are continuously improved through collaboration
                  with leading medical institutions and validation against
                  real-world clinical data.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#2563EB",
                    color: "#2563EB",
                    "&:hover": {
                      backgroundColor: "#2563EB",
                      color: "white",
                    },
                  }}
                >
                  Join Research Network
                </Button>
              </Paper>

              {/* Research Methodology */}
              <Paper sx={{ p: 3, borderRadius: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Our Research Approach
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Evidence-Based AI Development
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    All HepatoCAI tools are developed using peer-reviewed
                    research and validated against clinical standards.
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Continuous Learning
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Our AI models are regularly updated with the latest research
                    findings to ensure accuracy and relevance.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Clinical Validation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All diagnostic recommendations undergo rigorous testing and
                    validation by medical professionals.
                  </Typography>
                </Box>
              </Paper>
            </Grid>{" "}
          </Grid>
          {/* Call to Action Section */}
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Card
              sx={{ p: 4, borderRadius: "16px", backgroundColor: "#f8fafc" }}
            >
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Experience AI-Powered Hepatitis Care
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: "600px", mx: "auto" }}
                >
                  Leverage cutting-edge research and AI technology for accurate
                  diagnosis and personalized care. Our tools are trusted by
                  healthcare professionals worldwide.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    component="a"
                    href="/diagnosis"
                    startIcon={<DiagnosisIcon />}
                    sx={{
                      backgroundColor: "#2563EB",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      px: 3,
                    }}
                  >
                    Try Diagnosis Tool
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component="a"
                    href="/ai-assistant"
                    startIcon={<SmartToyIcon />}
                    sx={{
                      borderColor: "#2563EB",
                      color: "#2563EB",
                      "&:hover": {
                        backgroundColor: "#2563EB",
                        color: "white",
                      },
                      px: 3,
                    }}
                  >
                    Chat with AI Assistant
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Research;
