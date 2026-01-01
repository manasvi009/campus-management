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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Announcement as AnnouncementIcon,
  Upload as UploadIcon,
  QuestionAnswer as QueryIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { facultyAPI, studentAPI } from '../../services/api';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [facultyRes, statsRes] = await Promise.all([
        facultyAPI.getFacultyByUserId(user.id),
        facultyAPI.getFacultyStats(user.id)
      ]);

      setFacultyData(facultyRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const quickActions = [
    {
      title: 'Mark Attendance',
      icon: <AssessmentIcon />,
      color: 'primary',
      action: () => navigate('/dashboard/attendance'),
      description: 'Mark attendance for assigned classes'
    },
    {
      title: 'Upload Marks',
      icon: <AssignmentIcon />,
      color: 'secondary',
      action: () => navigate('/dashboard/results'),
      description: 'Upload exam results and grades'
    },
    {
      title: 'Upload Materials',
      icon: <UploadIcon />,
      color: 'success',
      action: () => navigate('/dashboard/study-materials'),
      description: 'Share study materials and resources'
    },
    {
      title: 'Post Announcement',
      icon: <AnnouncementIcon />,
      color: 'info',
      action: () => navigate('/dashboard/notices'),
      description: 'Post notices for students'
    },
    {
      title: 'Respond to Queries',
      icon: <QueryIcon />,
      color: 'warning',
      action: () => navigate('/dashboard/queries'),
      description: 'Answer student questions'
    },
    {
      title: 'View Timetable',
      icon: <ScheduleIcon />,
      color: 'default',
      action: () => navigate('/dashboard/timetable'),
      description: 'Check your teaching schedule'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Faculty Dashboard
      </Typography>

      {/* Welcome Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Department: {facultyData?.departmentId?.departmentName || 'Not assigned'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Employee ID: {facultyData?.employeeId || 'Not assigned'}
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats?.totalStudents || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students Assigned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats?.subjectsAssigned || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subjects Assigned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AnnouncementIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats?.noticesPosted || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notices Posted
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <QueryIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats?.pendingQueries || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Queries
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={action.action}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      bgcolor: `${action.color}.main`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      color: 'white'
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6">{action.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Assigned Subjects */}
      {facultyData?.subjectsAssigned && facultyData.subjectsAssigned.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assigned Subjects
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject Code</TableCell>
                    <TableCell>Subject Name</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>Credits</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facultyData.subjectsAssigned.map((subject) => (
                    <TableRow key={subject._id}>
                      <TableCell>{subject.subjectCode}</TableCell>
                      <TableCell>{subject.subjectName}</TableCell>
                      <TableCell>{subject.semester}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            <List>
              {stats.recentActivities.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={new Date(activity.timestamp).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent activities
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FacultyDashboard;