import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Campus Management System
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
        Welcome to our Smart Campus Solution
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" size="large" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="outlined" size="large" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;