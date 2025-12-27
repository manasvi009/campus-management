import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Book as BookIcon,
  Announcement as AnnouncementIcon,
  Work as WorkIcon,
  QueryStats as QueryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useAuth } from '../utils/useAuth';
import { adminAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const overviewCards = [
    {
      title: 'Total Students',
      value: stats?.overview?.totalStudents || 0,
      icon: <SchoolIcon />,
      color: '#1976d2',
      change: stats?.recentActivities?.newStudents || 0,
      changeText: 'new this week',
    },
    {
      title: 'Total Faculty',
      value: stats?.overview?.totalFaculty || 0,
      icon: <PersonIcon />,
      color: '#388e3c',
      change: stats?.recentActivities?.newFaculty || 0,
      changeText: 'new this week',
    },
    {
      title: 'Departments',
      value: stats?.overview?.totalDepartments || 0,
      icon: <BusinessIcon />,
      color: '#f57c00',
    },
    {
      title: 'Courses',
      value: stats?.overview?.totalCourses || 0,
      icon: <BookIcon />,
      color: '#7b1fa2',
    },
    {
      title: 'Active Notices',
      value: stats?.overview?.totalNotices || 0,
      icon: <AnnouncementIcon />,
      color: '#d32f2f',
      change: stats?.recentActivities?.newNotices || 0,
      changeText: 'new this week',
    },
    {
      title: 'Job Postings',
      value: stats?.overview?.totalJobPostings || 0,
      icon: <WorkIcon />,
      color: '#0288d1',
    },
  ];

  const quickActions = [
    { label: 'Approve Students', icon: <CheckCircleIcon />, color: 'success', count: stats?.overview?.pendingStudents || 0 },
    { label: 'Pending Queries', icon: <QueryIcon />, color: 'warning', count: stats?.overview?.pendingQueries || 0 },
    { label: 'Post Notice', icon: <AnnouncementIcon />, color: 'info' },
    { label: 'Add Faculty', icon: <PersonIcon />, color: 'primary' },
    { label: 'Manage Courses', icon: <BookIcon />, color: 'secondary' },
    { label: 'View Reports', icon: <BarChartIcon />, color: 'default' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        <BarChartIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}! Here's an overview of your campus management system.
      </Typography>

      {/* Overview Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {overviewCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                    {card.change > 0 && (
                      <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        +{card.change} {card.changeText}
                      </Typography>
                    )}
                  </Box>
                  <Avatar sx={{ bgcolor: card.color, width: 48, height: 48 }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Department-wise Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Department Distribution
              </Typography>
              <List dense>
                {stats?.departmentStats?.slice(0, 5).map((dept, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={dept._id}
                      secondary={`${dept.count} students`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={(dept.count / stats.overview.totalStudents) * 100}
                      sx={{ width: 100, ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Course-wise Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon sx={{ mr: 1 }} />
                Course Distribution
              </Typography>
              <List dense>
                {stats?.courseStats?.slice(0, 5).map((course, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={course._id}
                      secondary={`${course.count} students`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={(course.count / stats.overview.totalStudents) * 100}
                      sx={{ width: 100, ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={action.icon}
                      sx={{
                        height: 80,
                        flexDirection: 'column',
                        textTransform: 'none',
                        position: 'relative'
                      }}
                      color={action.color}
                    >
                      {action.label}
                      {action.count > 0 && (
                        <Chip
                          label={action.count}
                          size="small"
                          color="error"
                          sx={{ position: 'absolute', top: 4, right: 4 }}
                        />
                      )}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Recent Activities
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats?.recentActivities?.newStudents || 0} new students registered`}
                    secondary="This week"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats?.recentActivities?.newFaculty || 0} new faculty joined`}
                    secondary="This week"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnnouncementIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats?.recentActivities?.newNotices || 0} notices posted`}
                    secondary="This week"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <QueryIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${stats?.recentActivities?.newQueries || 0} queries submitted`}
                    secondary="This week"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Registration Trends (Last 6 Months)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">New Students</TableCell>
                      <TableCell align="right">New Faculty</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats?.monthlyStats?.map((month, index) => (
                      <TableRow key={index}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell align="right">{month.students}</TableCell>
                        <TableCell align="right">{month.faculty}</TableCell>
                        <TableCell align="right">{month.students + month.faculty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;