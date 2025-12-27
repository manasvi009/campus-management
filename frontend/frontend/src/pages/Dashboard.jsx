import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material';
import {
  School,
  Person,
  Business,
  Book,
} from '@mui/icons-material';
import { useAuth } from '../utils/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalStudents: 1250,
    totalFaculty: 85,
    totalDepartments: 12,
    totalCourses: 45,
  });

  // Mock data - in real app, fetch from API
  // useEffect(() => {
  //   // Simulate API call - data already set in state
  // }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <School />,
      color: '#1976d2',
    },
    {
      title: 'Total Faculty',
      value: stats.totalFaculty,
      icon: <Person />,
      color: '#388e3c',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: <Business />,
      color: '#f57c00',
    },
    {
      title: 'Courses',
      value: stats.totalCourses,
      icon: <Book />,
      color: '#7b1fa2',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's what's happening in your campus today.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: card.color, mr: 2 }}>
                    {card.icon}
                  </Avatar>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • New student enrollment: John Doe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Faculty meeting scheduled for tomorrow
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Exam results published for Semester 4
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Add new student
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Mark attendance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Post notice
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;