import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Schedule as ScheduleIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { facultyAPI } from '../../services/api';

const FacultyTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await facultyAPI.getFacultyTimetable();
      setTimetable(response.data || []);
    } catch (err) {
      setError('Failed to load timetable');
      console.error('Timetable error:', err);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  const getClassForSlot = (day, timeSlot) => {
    return timetable.find(slot =>
      slot.dayOfWeek === day &&
      slot.startTime === timeSlot.split(' - ')[0] &&
      slot.endTime === timeSlot.split(' - ')[1]
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading timetable...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <ScheduleIcon sx={{ mr: 2 }} />
        My Timetable
      </Typography>

      {/* Timetable Grid */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Time</TableCell>
              {daysOfWeek.map(day => (
                <TableCell key={day} align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map(timeSlot => (
              <TableRow key={timeSlot}>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                  <Box display="flex" alignItems="center">
                    <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                    {timeSlot}
                  </Box>
                </TableCell>
                {daysOfWeek.map(day => {
                  const classSlot = getClassForSlot(day, timeSlot);
                  return (
                    <TableCell key={`${day}-${timeSlot}`} align="center">
                      {classSlot ? (
                        <Card sx={{ minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {classSlot.subjectId?.subjectName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {classSlot.subjectId?.subjectCode}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Room: {classSlot.roomNumber}
                            </Typography>
                            <Chip
                              label={classSlot.classType}
                              size="small"
                              color={classSlot.classType === 'Lecture' ? 'primary' : 'secondary'}
                              sx={{ mt: 0.5, fontSize: '0.7rem' }}
                            />
                          </CardContent>
                        </Card>
                      ) : (
                        <Box sx={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Today's Schedule */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Schedule ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
          </Typography>
          {(() => {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const todaysClasses = timetable.filter(slot => slot.dayOfWeek === today);

            if (todaysClasses.length === 0) {
              return (
                <Typography variant="body2" color="text.secondary">
                  No classes scheduled for today
                </Typography>
              );
            }

            return (
              <Grid container spacing={2}>
                {todaysClasses.map((classSlot, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {classSlot.subjectId?.subjectName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {classSlot.subjectId?.subjectCode}
                        </Typography>
                        <Typography variant="body2">
                          Time: {classSlot.startTime} - {classSlot.endTime}
                        </Typography>
                        <Typography variant="body2">
                          Room: {classSlot.roomNumber}
                        </Typography>
                        <Chip
                          label={classSlot.classType}
                          size="small"
                          color={classSlot.classType === 'Lecture' ? 'primary' : 'secondary'}
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            );
          })()}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FacultyTimetable;