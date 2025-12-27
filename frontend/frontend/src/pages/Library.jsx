import React from 'react';
import { Typography, Box } from '@mui/material';

const Library = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Library Management
      </Typography>
      <Typography variant="body1">
        Manage books, issues, and returns.
      </Typography>
    </Box>
  );
};

export default Library;