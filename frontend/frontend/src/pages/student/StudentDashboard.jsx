import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Announcement as AnnouncementIcon,
  Download as DownloadIcon,
  QuestionAnswer as QueryIcon,
  Work as WorkIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { studentAPI } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentRes, enrollmentRes] = await Promise.all([
        studentAPI.getStudentProfile(),
        studentAPI.getEnrollmentStats()
      ]);

      setStudentData(studentRes.data);
      setEnrollmentStats(enrollmentRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'My Profile',
      icon: <ProfileIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description: 'View and update your profile',
      path: '/dashboard/profile',
      color: 'primary'
    },
    {
      title: 'Course Enrollment',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      description: 'Enroll in subjects',
      path: '/dashboard/enrollment',
      color: 'success'
    },
    {
      title: 'My Timetable',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      description: 'View your class schedule',
      path: '/dashboard/timetable',
      color: 'info'
    },
    {
      title: 'Attendance',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      description: 'Check your attendance',
      path: '/dashboard/attendance',
      color: 'warning'
    },
    {
      title: 'Study Materials',
      icon: <DownloadIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      description: 'Download study materials',
      path: '/dashboard/study-materials',
      color: 'secondary'
    },
    {
      title: 'Queries',
      icon: <QueryIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      description: 'Raise complaints & queries',
      path: '/dashboard/queries',
      color: 'error'
    },
    {
      title: 'Notices',
      icon: <AnnouncementIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      description: 'View announcements',
      path: '/dashboard/notices',
      color: 'primary'
    },
    {
      title: 'Placement',
      icon: <WorkIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      description: 'Internship & placement info',
      path: '/dashboard/placement',
      color: 'success'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {user?.approvalStatus === 'pending' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your account is pending admin approval. Some features may be limited until your account is verified.
        </Alert>
      )}

      {user?.approvalStatus === 'rejected' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Your account registration has been rejected. Please contact the administrator for more information.
        </Alert>
      )}

      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        {studentData && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={`Enrollment: ${studentData.enrollmentNumber}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Semester: ${studentData.semester}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`Department: ${studentData.departmentId?.departmentName || 'N/A'}`}
              color="info"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      {/* Stats Cards */}
      {enrollmentStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Enrollments
                </Typography>
                <Typography variant="h4">
                  {enrollmentStats.data.totalEnrollments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Current Semester
                </Typography>
                <Typography variant="h4">
                  {enrollmentStats.data.currentSemester}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Academic Year
                </Typography>
                <Typography variant="h6">
                  {enrollmentStats.data.academicYear}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Account Status
                </Typography>
                <Chip
                  label={
                    user?.approvalStatus === 'approved' ? 'Verified' :
                    user?.approvalStatus === 'pending' ? 'Pending Approval' :
                    user?.approvalStatus === 'rejected' ? 'Rejected' : 'Active'
                  }
                  color={
                    user?.approvalStatus === 'approved' ? 'success' :
                    user?.approvalStatus === 'pending' ? 'warning' :
                    user?.approvalStatus === 'rejected' ? 'error' : 'default'
                  }
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Quick Actions */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                {action.icon}
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
                <Button
                  variant="outlined"
                  color={action.color}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentDashboard;