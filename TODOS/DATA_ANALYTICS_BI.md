# Data Analytics and Business Intelligence Enhancements

## 1. Advanced Analytics Dashboard

### Real-time Analytics Engine

**Create `backend/analytics/__init__.py`:**

```python
# Analytics package for HepatoCAI
```

**Create `backend/analytics/models.py`:**

```python
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import json

User = get_user_model()

class AnalyticsEvent(models.Model):
    """Track user interactions and system events"""

    EVENT_TYPES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('diagnosis_start', 'Diagnosis Started'),
        ('diagnosis_complete', 'Diagnosis Completed'),
        ('report_generated', 'Report Generated'),
        ('ai_consultation', 'AI Consultation'),
        ('data_export', 'Data Export'),
        ('admin_action', 'Admin Action'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    session_id = models.CharField(max_length=100, db_index=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()

    # Event-specific data
    metadata = models.JSONField(default=dict)

    # Performance metrics
    duration_ms = models.IntegerField(null=True, blank=True)
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)

    class Meta:
        db_table = 'analytics_events'
        indexes = [
            models.Index(fields=['timestamp', 'event_type']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['session_id']),
        ]

class DiagnosisAnalytics(models.Model):
    """Detailed analytics for diagnosis patterns"""

    diagnosis = models.OneToOneField('diagnosis.HCVPatient', on_delete=models.CASCADE)

    # Risk factors analysis
    risk_score = models.FloatField()
    primary_risk_factors = models.JSONField(default=list)

    # Prediction confidence
    ai_confidence_score = models.FloatField()
    model_version = models.CharField(max_length=50)

    # Clinical patterns
    similar_cases_count = models.IntegerField(default=0)
    treatment_recommendations = models.JSONField(default=list)

    # Outcome tracking
    follow_up_required = models.BooleanField(default=False)
    severity_level = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'diagnosis_analytics'

class SystemMetrics(models.Model):
    """System performance and health metrics"""

    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    # Performance metrics
    response_time_avg = models.FloatField()
    response_time_p95 = models.FloatField()
    request_count = models.IntegerField()
    error_rate = models.FloatField()

    # System resources
    cpu_usage = models.FloatField()
    memory_usage = models.FloatField()
    disk_usage = models.FloatField()

    # Database metrics
    db_connections = models.IntegerField()
    slow_queries = models.IntegerField()

    # User metrics
    active_users = models.IntegerField()
    new_registrations = models.IntegerField()

    class Meta:
        db_table = 'system_metrics'
        indexes = [
            models.Index(fields=['timestamp']),
        ]
```

**Create `backend/analytics/services.py`:**

```python
from django.db.models import Count, Avg, Q, F
from django.utils import timezone
from datetime import timedelta, datetime
from .models import AnalyticsEvent, DiagnosisAnalytics, SystemMetrics
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class AnalyticsService:
    """Service for analytics data processing"""

    @staticmethod
    def track_event(event_type, user=None, session_id=None, ip_address=None,
                   user_agent=None, metadata=None, duration_ms=None, success=True, error_message=''):
        """Track analytics event"""
        AnalyticsEvent.objects.create(
            user=user,
            event_type=event_type,
            session_id=session_id or 'unknown',
            ip_address=ip_address or '127.0.0.1',
            user_agent=user_agent or 'unknown',
            metadata=metadata or {},
            duration_ms=duration_ms,
            success=success,
            error_message=error_message
        )

    @staticmethod
    def get_user_engagement_metrics(days=30):
        """Get user engagement metrics"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)

        # Daily active users
        dau = AnalyticsEvent.objects.filter(
            timestamp__gte=start_date,
            event_type='login'
        ).values('timestamp__date').annotate(
            users=Count('user', distinct=True)
        ).order_by('timestamp__date')

        # User retention
        retention_data = []
        for i in range(7):  # 7-day retention
            cohort_date = end_date - timedelta(days=i*7)
            new_users = User.objects.filter(
                date_joined__gte=cohort_date,
                date_joined__lt=cohort_date + timedelta(days=7)
            ).values_list('id', flat=True)

            retained_users = AnalyticsEvent.objects.filter(
                user_id__in=new_users,
                timestamp__gte=cohort_date + timedelta(days=7),
                timestamp__lt=cohort_date + timedelta(days=14),
                event_type='login'
            ).values_list('user', flat=True).distinct().count()

            retention_rate = (retained_users / len(new_users) * 100) if new_users else 0
            retention_data.append({
                'week': i + 1,
                'cohort_size': len(new_users),
                'retained': retained_users,
                'retention_rate': retention_rate
            })

        return {
            'daily_active_users': list(dau),
            'retention_analysis': retention_data
        }

    @staticmethod
    def get_diagnosis_insights(days=30):
        """Get diagnosis-related insights"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)

        # Diagnosis completion rates
        started = AnalyticsEvent.objects.filter(
            timestamp__gte=start_date,
            event_type='diagnosis_start'
        ).count()

        completed = AnalyticsEvent.objects.filter(
            timestamp__gte=start_date,
            event_type='diagnosis_complete'
        ).count()

        completion_rate = (completed / started * 100) if started > 0 else 0

        # Average diagnosis time
        avg_duration = AnalyticsEvent.objects.filter(
            timestamp__gte=start_date,
            event_type='diagnosis_complete',
            duration_ms__isnull=False
        ).aggregate(avg_duration=Avg('duration_ms'))

        # Risk factor analysis
        risk_factors = DiagnosisAnalytics.objects.filter(
            created_at__gte=start_date
        ).values_list('primary_risk_factors', flat=True)

        # Flatten and count risk factors
        all_factors = []
        for factors in risk_factors:
            if isinstance(factors, list):
                all_factors.extend(factors)

        factor_counts = {}
        for factor in all_factors:
            factor_counts[factor] = factor_counts.get(factor, 0) + 1

        return {
            'total_diagnoses_started': started,
            'total_diagnoses_completed': completed,
            'completion_rate': completion_rate,
            'average_duration_minutes': (avg_duration['avg_duration'] or 0) / 60000,
            'top_risk_factors': sorted(factor_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        }

    @staticmethod
    def get_performance_metrics(hours=24):
        """Get system performance metrics"""
        end_time = timezone.now()
        start_time = end_time - timedelta(hours=hours)

        # Get latest system metrics
        latest_metrics = SystemMetrics.objects.filter(
            timestamp__gte=start_time
        ).order_by('-timestamp')

        if not latest_metrics.exists():
            return None

        # Calculate averages
        avg_metrics = latest_metrics.aggregate(
            avg_response_time=Avg('response_time_avg'),
            avg_cpu=Avg('cpu_usage'),
            avg_memory=Avg('memory_usage'),
            avg_error_rate=Avg('error_rate'),
            total_requests=Count('request_count')
        )

        # Error analysis
        error_events = AnalyticsEvent.objects.filter(
            timestamp__gte=start_time,
            success=False
        ).values('event_type').annotate(
            error_count=Count('id')
        ).order_by('-error_count')

        return {
            'performance_summary': avg_metrics,
            'error_breakdown': list(error_events),
            'metrics_count': latest_metrics.count()
        }

class ReportingService:
    """Generate analytical reports"""

    @staticmethod
    def generate_weekly_report():
        """Generate comprehensive weekly report"""
        analytics = AnalyticsService()

        # User metrics
        user_metrics = analytics.get_user_engagement_metrics(7)

        # Diagnosis metrics
        diagnosis_metrics = analytics.get_diagnosis_insights(7)

        # Performance metrics
        performance_metrics = analytics.get_performance_metrics(168)  # 7 days

        # System health
        total_users = User.objects.count()
        active_users_week = AnalyticsEvent.objects.filter(
            timestamp__gte=timezone.now() - timedelta(days=7),
            event_type='login'
        ).values('user').distinct().count()

        report = {
            'report_date': timezone.now().isoformat(),
            'period': 'Last 7 days',
            'summary': {
                'total_users': total_users,
                'active_users': active_users_week,
                'user_engagement_rate': (active_users_week / total_users * 100) if total_users > 0 else 0
            },
            'user_engagement': user_metrics,
            'diagnosis_insights': diagnosis_metrics,
            'system_performance': performance_metrics,
            'recommendations': ReportingService._generate_recommendations(
                user_metrics, diagnosis_metrics, performance_metrics
            )
        }

        return report

    @staticmethod
    def _generate_recommendations(user_metrics, diagnosis_metrics, performance_metrics):
        """Generate actionable recommendations based on data"""
        recommendations = []

        # User engagement recommendations
        if user_metrics.get('retention_analysis'):
            avg_retention = sum(r['retention_rate'] for r in user_metrics['retention_analysis']) / len(user_metrics['retention_analysis'])
            if avg_retention < 30:
                recommendations.append({
                    'category': 'User Engagement',
                    'priority': 'High',
                    'issue': f'Low user retention rate ({avg_retention:.1f}%)',
                    'recommendation': 'Implement user onboarding improvements and engagement campaigns'
                })

        # Diagnosis workflow recommendations
        if diagnosis_metrics.get('completion_rate', 0) < 70:
            recommendations.append({
                'category': 'User Experience',
                'priority': 'High',
                'issue': f'Low diagnosis completion rate ({diagnosis_metrics.get("completion_rate", 0):.1f}%)',
                'recommendation': 'Simplify diagnosis workflow and add progress indicators'
            })

        # Performance recommendations
        if performance_metrics and performance_metrics.get('performance_summary'):
            avg_response = performance_metrics['performance_summary'].get('avg_response_time', 0)
            if avg_response > 2000:  # 2 seconds
                recommendations.append({
                    'category': 'Performance',
                    'priority': 'Medium',
                    'issue': f'Slow average response time ({avg_response/1000:.1f}s)',
                    'recommendation': 'Optimize database queries and implement caching'
                })

        return recommendations
```

## 2. Business Intelligence Dashboard

### Advanced Analytics Views

**Create `backend/analytics/views.py`:**

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .services import AnalyticsService, ReportingService
from utils.responses import StandardResponse

@api_view(['GET'])
@permission_classes([IsAdminUser])
@cache_page(60 * 15)  # Cache for 15 minutes
def analytics_dashboard(request):
    """Main analytics dashboard data"""
    try:
        days = int(request.GET.get('days', 30))

        # Get all analytics data
        user_engagement = AnalyticsService.get_user_engagement_metrics(days)
        diagnosis_insights = AnalyticsService.get_diagnosis_insights(days)
        performance_metrics = AnalyticsService.get_performance_metrics(24)

        dashboard_data = {
            'user_engagement': user_engagement,
            'diagnosis_insights': diagnosis_insights,
            'performance_metrics': performance_metrics,
            'period_days': days
        }

        return StandardResponse.success(
            data=dashboard_data,
            message="Analytics dashboard data retrieved successfully"
        )

    except Exception as e:
        return StandardResponse.error(
            message=f"Error retrieving analytics data: {str(e)}",
            status_code=500
        )

@api_view(['GET'])
@permission_classes([IsAdminUser])
def weekly_report(request):
    """Generate and return weekly analytics report"""
    try:
        report = ReportingService.generate_weekly_report()

        return StandardResponse.success(
            data=report,
            message="Weekly report generated successfully"
        )

    except Exception as e:
        return StandardResponse.error(
            message=f"Error generating weekly report: {str(e)}",
            status_code=500
        )

@api_view(['POST'])
@permission_classes([IsAdminUser])
def export_analytics(request):
    """Export analytics data in various formats"""
    try:
        format_type = request.data.get('format', 'json')  # json, csv, excel
        days = int(request.data.get('days', 30))

        if format_type == 'csv':
            # Implementation for CSV export
            pass
        elif format_type == 'excel':
            # Implementation for Excel export
            pass
        else:
            # Default JSON export
            analytics_data = {
                'user_engagement': AnalyticsService.get_user_engagement_metrics(days),
                'diagnosis_insights': AnalyticsService.get_diagnosis_insights(days),
                'performance_metrics': AnalyticsService.get_performance_metrics(24)
            }

            return StandardResponse.success(
                data=analytics_data,
                message="Analytics data exported successfully"
            )

    except Exception as e:
        return StandardResponse.error(
            message=f"Error exporting analytics data: {str(e)}",
            status_code=500
        )
```

## 3. Machine Learning Integration

### Predictive Analytics

**Create `backend/analytics/ml_insights.py`:**

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from django.db.models import Count, Avg
from datetime import timedelta
from django.utils import timezone
from .models import AnalyticsEvent, DiagnosisAnalytics

class MLInsightsEngine:
    """Machine learning powered insights"""

    @staticmethod
    def detect_usage_anomalies(days=30):
        """Detect unusual usage patterns"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)

        # Get daily usage data
        daily_usage = AnalyticsEvent.objects.filter(
            timestamp__gte=start_date
        ).extra(
            select={'day': 'DATE(timestamp)'}
        ).values('day').annotate(
            event_count=Count('id'),
            unique_users=Count('user', distinct=True),
            avg_duration=Avg('duration_ms')
        ).order_by('day')

        if len(daily_usage) < 7:  # Need at least a week of data
            return {'anomalies': [], 'message': 'Insufficient data for anomaly detection'}

        # Prepare data for ML
        df = pd.DataFrame(daily_usage)
        features = ['event_count', 'unique_users', 'avg_duration']

        # Handle missing values
        for feature in features:
            df[feature] = df[feature].fillna(df[feature].mean())

        # Normalize features
        scaler = StandardScaler()
        X = scaler.fit_transform(df[features])

        # Detect anomalies
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        anomalies = iso_forest.fit_predict(X)

        # Format results
        anomaly_days = []
        for i, is_anomaly in enumerate(anomalies):
            if is_anomaly == -1:  # Anomaly detected
                anomaly_days.append({
                    'date': daily_usage[i]['day'],
                    'event_count': daily_usage[i]['event_count'],
                    'unique_users': daily_usage[i]['unique_users'],
                    'avg_duration': daily_usage[i]['avg_duration'],
                    'anomaly_score': iso_forest.decision_function(X[i:i+1])[0]
                })

        return {
            'anomalies': anomaly_days,
            'total_days_analyzed': len(daily_usage),
            'anomalies_detected': len(anomaly_days)
        }

    @staticmethod
    def predict_user_churn(user_id):
        """Predict likelihood of user churn"""
        try:
            # Get user's activity pattern
            user_events = AnalyticsEvent.objects.filter(
                user_id=user_id,
                timestamp__gte=timezone.now() - timedelta(days=30)
            ).order_by('timestamp')

            if not user_events.exists():
                return {'churn_probability': 0.5, 'confidence': 'low', 'reason': 'Insufficient data'}

            # Calculate features
            total_events = user_events.count()
            last_activity = user_events.last().timestamp
            days_since_last_activity = (timezone.now() - last_activity).days

            # Simple heuristic-based model (replace with trained ML model)
            if days_since_last_activity > 7:
                churn_prob = min(0.9, 0.3 + (days_since_last_activity - 7) * 0.1)
            elif total_events < 5:
                churn_prob = 0.7
            else:
                churn_prob = max(0.1, 0.5 - (total_events * 0.05))

            # Determine confidence level
            if total_events >= 10 and days_since_last_activity <= 3:
                confidence = 'high'
            elif total_events >= 5:
                confidence = 'medium'
            else:
                confidence = 'low'

            return {
                'churn_probability': round(churn_prob, 2),
                'confidence': confidence,
                'factors': {
                    'days_since_last_activity': days_since_last_activity,
                    'total_events': total_events,
                    'last_activity': last_activity.isoformat()
                }
            }

        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def analyze_diagnosis_patterns():
        """Analyze patterns in diagnosis data"""
        # Get diagnosis analytics data
        diagnoses = DiagnosisAnalytics.objects.all()

        if not diagnoses.exists():
            return {'message': 'No diagnosis data available'}

        # Risk score distribution
        risk_scores = [d.risk_score for d in diagnoses if d.risk_score]

        # Common risk factor combinations
        risk_factor_combinations = {}
        for diagnosis in diagnoses:
            if diagnosis.primary_risk_factors:
                factors_key = tuple(sorted(diagnosis.primary_risk_factors))
                risk_factor_combinations[factors_key] = risk_factor_combinations.get(factors_key, 0) + 1

        # AI confidence analysis
        confidence_scores = [d.ai_confidence_score for d in diagnoses if d.ai_confidence_score]

        return {
            'total_diagnoses': diagnoses.count(),
            'risk_score_stats': {
                'mean': np.mean(risk_scores) if risk_scores else 0,
                'median': np.median(risk_scores) if risk_scores else 0,
                'std': np.std(risk_scores) if risk_scores else 0
            },
            'top_risk_combinations': sorted(
                risk_factor_combinations.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10],
            'ai_confidence_stats': {
                'mean': np.mean(confidence_scores) if confidence_scores else 0,
                'min': np.min(confidence_scores) if confidence_scores else 0,
                'max': np.max(confidence_scores) if confidence_scores else 0
            }
        }
```

## 4. Frontend Analytics Dashboard

### Advanced Analytics Components

**Create `frontend/src/pages/admin/AdvancedAnalytics.jsx`:**

```jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  TrendingUp,
  Warning,
  Analytics,
  PredictiveText,
  Download,
  Refresh,
  Timeline,
  Assessment,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import api from "../../api";
import AdminNavbar from "../../components/admin/AdminNavbar";

function AdvancedAnalytics() {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState(30);
  const [analyticsData, setAnalyticsData] = useState({
    userEngagement: {},
    diagnosisInsights: {},
    performanceMetrics: {},
    anomalies: [],
    predictions: {},
  });
  const [weeklyReport, setWeeklyReport] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, reportRes] = await Promise.all([
        api.get(`/analytics/dashboard/?days=${timeRange}`),
        api.get("/analytics/weekly-report/"),
      ]);

      setAnalyticsData(dashboardRes.data.data);
      setWeeklyReport(reportRes.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format) => {
    try {
      const response = await api.post("/analytics/export/", {
        format,
        days: timeRange,
      });

      // Handle download based on format
      if (format === "json") {
        const blob = new Blob([JSON.stringify(response.data.data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
      }
    } catch (error) {
      console.error("Error exporting analytics:", error);
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AdminNavbar />

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">Advanced Analytics</Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => exportAnalytics("json")}
            >
              Export Data
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAnalyticsData}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="User Engagement" />
          <Tab label="Diagnosis Insights" />
          <Tab label="Performance Metrics" />
          <Tab label="Anomaly Detection" />
          <Tab label="Weekly Report" />
        </Tabs>

        {/* User Engagement Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Daily Active Users
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={
                        analyticsData.userEngagement.daily_active_users || []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp__date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Retention
                  </Typography>
                  {analyticsData.userEngagement.retention_analysis?.map(
                    (week, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          Week {week.week}: {week.retention_rate.toFixed(1)}%
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            backgroundColor: "#f0f0f0",
                            borderRadius: 4,
                            mt: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: `${week.retention_rate}%`,
                              height: "100%",
                              backgroundColor:
                                week.retention_rate > 50
                                  ? "#4caf50"
                                  : "#ff9800",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      </Box>
                    )
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Diagnosis Insights Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Diagnosis Completion Rate
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {analyticsData.diagnosisInsights.completion_rate?.toFixed(
                      1
                    )}
                    %
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {analyticsData.diagnosisInsights.total_diagnoses_completed}{" "}
                    completed out of{" "}
                    {analyticsData.diagnosisInsights.total_diagnoses_started}{" "}
                    started
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Risk Factors
                  </Typography>
                  {analyticsData.diagnosisInsights.top_risk_factors
                    ?.slice(0, 5)
                    .map(([factor, count], index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">{factor}</Typography>
                        <Chip label={count} size="small" />
                      </Box>
                    ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Metrics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Response Time
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {analyticsData.performanceMetrics?.performance_summary?.avg_response_time?.toFixed(
                      0
                    )}
                    ms
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Error Rate
                  </Typography>
                  <Typography variant="h3" color="error">
                    {analyticsData.performanceMetrics?.performance_summary?.avg_error_rate?.toFixed(
                      2
                    )}
                    %
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Load
                  </Typography>
                  <Typography variant="h3" color="warning.main">
                    {analyticsData.performanceMetrics?.performance_summary?.avg_cpu?.toFixed(
                      1
                    )}
                    %
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Anomaly Detection Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Anomalies Detected
              </Typography>
              {analyticsData.anomalies?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Event Count</TableCell>
                        <TableCell>Unique Users</TableCell>
                        <TableCell>Anomaly Score</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.anomalies.map((anomaly, index) => (
                        <TableRow key={index}>
                          <TableCell>{anomaly.date}</TableCell>
                          <TableCell>{anomaly.event_count}</TableCell>
                          <TableCell>{anomaly.unique_users}</TableCell>
                          <TableCell>
                            {anomaly.anomaly_score?.toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Anomaly"
                              color="warning"
                              size="small"
                              icon={<Warning />}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="success">
                  No anomalies detected in the selected time period.
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Weekly Report Tab */}
        <TabPanel value={tabValue} index={4}>
          {weeklyReport && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Weekly Report Summary
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Report Period: {weeklyReport.period}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Total Users: {weeklyReport.summary?.total_users}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Active Users: {weeklyReport.summary?.active_users}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Engagement Rate:{" "}
                      {weeklyReport.summary?.user_engagement_rate?.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {weeklyReport.recommendations?.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recommendations
                      </Typography>
                      {weeklyReport.recommendations.map((rec, index) => (
                        <Alert
                          key={index}
                          severity={
                            rec.priority === "High" ? "error" : "warning"
                          }
                          sx={{ mb: 2 }}
                        >
                          <Typography variant="subtitle2">
                            {rec.category}
                          </Typography>
                          <Typography variant="body2">{rec.issue}</Typography>
                          <Typography variant="body2">
                            <strong>Recommendation:</strong>{" "}
                            {rec.recommendation}
                          </Typography>
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
}

export default AdvancedAnalytics;
```

This analytics enhancement provides comprehensive business intelligence capabilities including user engagement tracking, diagnosis pattern analysis, anomaly detection, predictive insights, and automated reporting for data-driven decision making.
