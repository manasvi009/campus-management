import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 4 }}
        >
          Back to Home
        </Button>

        <Typography variant="h2" component="h1" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          About Campus Management System
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph>
                  To provide educational institutions with a comprehensive, user-friendly management system
                  that streamlines administrative processes and enhances the learning experience for students,
                  faculty, and administrators.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  Our Vision
                </Typography>
                <Typography variant="body1" paragraph>
                  To be the leading provider of campus management solutions, empowering educational
                  institutions worldwide to achieve operational excellence and academic success through
                  innovative technology and exceptional service.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                  Key Features
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" gutterBottom>Student Management</Typography>
                    <Typography variant="body2">
                      Complete student lifecycle management from enrollment to graduation.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" gutterBottom>Faculty Administration</Typography>
                    <Typography variant="body2">
                      Streamlined faculty profiles, schedules, and performance tracking.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" gutterBottom>Academic Analytics</Typography>
                    <Typography variant="body2">
                      Comprehensive reporting and analytics for data-driven decisions.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" gutterBottom>Resource Management</Typography>
                    <Typography variant="body2">
                      Efficient management of courses, departments, and facilities.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;