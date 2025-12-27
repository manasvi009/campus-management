import React from 'react';
import { Typography, Box } from '@mui/material';

const Notices = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notices & Announcements
      </Typography>
      <Typography variant="body1">
        Post and manage campus notices and announcements.
      </Typography>
    </Box>
  );
};

export default Notices;