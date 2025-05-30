import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import NavBar from "../components/layout/NavBar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsPage = () => {
  const { data: analyticsData, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <Box>
        <NavBar />
        <Container sx={{ mt: 4 }}>
          <Typography>Loading analytics...</Typography>
        </Container>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <NavBar />
        <Container sx={{ mt: 4 }}>
          <Typography color="error">Error loading analytics data</Typography>
        </Container>
      </Box>
    );
  }

  const mockData = {
    monthlyDiagnoses: [
      { month: "Jan", count: 12 },
      { month: "Feb", count: 19 },
      { month: "Mar", count: 15 },
      { month: "Apr", count: 22 },
      { month: "May", count: 18 },
    ],
    severityDistribution: [
      { name: "Mild", value: 30 },
      { name: "Moderate", value: 45 },
      { name: "Severe", value: 20 },
      { name: "Critical", value: 5 },
    ],
    weeklyTrends: [
      { day: "Mon", diagnoses: 8 },
      { day: "Tue", diagnoses: 12 },
      { day: "Wed", diagnoses: 15 },
      { day: "Thu", diagnoses: 10 },
      { day: "Fri", diagnoses: 18 },
      { day: "Sat", diagnoses: 6 },
      { day: "Sun", diagnoses: 4 },
    ],
  };

  return (
    <Box>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Diagnoses
                </Typography>
                <Typography variant="h5" component="h2">
                  {analyticsData?.totalDiagnoses || 86}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  This Month
                </Typography>
                <Typography variant="h5" component="h2">
                  {analyticsData?.thisMonth || 18}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Accuracy Rate
                </Typography>
                <Typography variant="h5" component="h2">
                  {analyticsData?.accuracyRate || "94.2%"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Processing
                </Typography>
                <Typography variant="h5" component="h2">
                  {analyticsData?.avgProcessingTime || "2.3s"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Diagnoses Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Diagnoses
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.monthlyDiagnoses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Severity Distribution */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockData.severityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.severityDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Weekly Trends */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Diagnosis Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="diagnoses"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AnalyticsPage;
