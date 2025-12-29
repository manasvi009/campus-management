import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Schedule as ScheduleIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [availableSemesters, setAvailableSemesters] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  useEffect(() => {
    fetchTimetable();
  }, [selectedSemester, fetchTimetable]);

  const fetchTimetable = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudentTimetable(selectedSemester ? { semester: selectedSemester } : {});
      setTimetable(response.data.timetable || []);
      setAvailableSemesters(response.data.availableSemesters || []);
    } catch {
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  }, [selectedSemester]);

  const getClassForSlot = (day, time) => {
    return timetable.find(slot =>
      slot.dayOfWeek === day &&
      slot.startTime === time.split(' - ')[0] &&
      slot.endTime === time.split(' - ')[1]
    );
  };

  const formatTime = (timeString) => {
    return timeString.replace(':00', '');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading timetable...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Class Timetable
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your weekly class schedule
          </Typography>
        </Box>

        {availableSemesters.length > 1 && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Semester</InputLabel>
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              label="Semester"
            >
              <MenuItem value="">All Semesters</MenuItem>
              {availableSemesters.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  Semester {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Today's Classes Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">
                    {timetable.filter(slot => slot.dayOfWeek === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classes Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimeIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">{timetable.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Classes This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Timetable Grid */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Weekly Schedule
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Time</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day} sx={{ fontWeight: 'bold', bgcolor: 'grey.100', textAlign: 'center' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow key={timeSlot}>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                    {timeSlot}
                  </TableCell>
                  {daysOfWeek.map((day) => {
                    const classSlot = getClassForSlot(day, timeSlot);
                    return (
                      <TableCell key={`${day}-${timeSlot}`} sx={{ p: 1 }}>
                        {classSlot ? (
                          <Box
                            sx={{
                              p: 1,
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              borderRadius: 1,
                              textAlign: 'center',
                              minHeight: 60,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {classSlot.subjectId?.subjectCode}
                            </Typography>
                            <Typography variant="caption">
                              {classSlot.subjectId?.subjectName}
                            </Typography>
                            <Typography variant="caption">
                              {classSlot.roomNumber}
                            </Typography>
                            <Chip
                              label={classSlot.facultyId?.name || 'TBA'}
                              size="small"
                              sx={{
                                mt: 0.5,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              minHeight: 60,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'text.secondary',
                            }}
                          >
                            -
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
      </Paper>

      {/* Today's Classes Detail */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Today's Classes ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
        </Typography>

        {(() => {
          const todayClasses = timetable.filter(
            slot => slot.dayOfWeek === new Date().toLocaleDateString('en-US', { weekday: 'long' })
          ).sort((a, b) => a.startTime.localeCompare(b.startTime));

          if (todayClasses.length === 0) {
            return (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No classes scheduled for today
              </Typography>
            );
          }

          return (
            <Grid container spacing={2}>
              {todayClasses.map((classSlot) => (
                <Grid item xs={12} md={6} key={classSlot._id}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="h6">
                            {classSlot.subjectId?.subjectCode}
                          </Typography>
                          <Typography variant="body2">
                            {classSlot.subjectId?.subjectName}
                          </Typography>
                          <Typography variant="body2">
                            Room: {classSlot.roomNumber}
                          </Typography>
                          <Typography variant="body2">
                            Faculty: {classSlot.facultyId?.name || 'TBA'}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${formatTime(classSlot.startTime)} - ${formatTime(classSlot.endTime)}`}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          );
        })()}
      </Paper>
    </Container>
  );
};

export default Timetable;