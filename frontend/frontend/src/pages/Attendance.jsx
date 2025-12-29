import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CheckCircle as PresentIcon, Cancel as AbsentIcon } from '@mui/icons-material';
import { attendanceAPI, facultyAPI } from '../services/api';
import { useAuth } from '../utils/useAuth';

const Attendance = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'faculty') {
      fetchFacultySubjects();
    }
  }, [user, fetchFacultySubjects]);

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      fetchStudentsAndAttendance();
    }
  }, [selectedSubject, selectedDate, fetchStudentsAndAttendance]);

  const fetchFacultySubjects = useCallback(async () => {
    try {
      // Get faculty details to find assigned subjects
      const facultyResponse = await facultyAPI.getFacultyByUserId(user._id);
      const faculty = facultyResponse.data.data;

      // For now, we'll assume faculty teaches all subjects in their department
      // In a real app, you'd have a FacultySubject model
      setSubjects(faculty.subjectsAssigned || []);
    } catch {
      setError('Failed to fetch subjects');
    }
  }, [user, setSubjects, setError]);

  const fetchStudentsAndAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Get enrolled students for this subject
      const studentsResponse = await attendanceAPI.getEnrolledStudents(selectedSubject);
      const enrolledStudents = studentsResponse.data.data;
      setStudents(enrolledStudents);

      // Get existing attendance for this subject and date
      const attendanceResponse = await attendanceAPI.getSubjectAttendance(selectedSubject, {
        date: selectedDate.toISOString().split('T')[0]
      });

      // Create attendance data map from existing records
      const attendanceMap = {};
      attendanceResponse.data.data.forEach(record => {
        attendanceMap[record.studentId._id] = record.status;
      });
      setAttendanceData(attendanceMap);

    } catch {
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedDate, setLoading, setError, setStudents, setAttendanceData]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleBulkMark = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const bulkData = {
        subjectId: selectedSubject,
        date: selectedDate.toISOString().split('T')[0],
        attendanceData: students.map(student => ({
          studentId: student._id,
          status: attendanceData[student._id] || 'absent'
        }))
      };

      await attendanceAPI.bulkMarkAttendance(bulkData);
      setSuccess('Attendance marked successfully');
      fetchStudentsAndAttendance(); // Refresh data
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <PresentIcon />;
      case 'absent': return <AbsentIcon />;
      default: return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Mark Attendance
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  label="Select Subject"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.subjectName} ({subject.subjectCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={handleBulkMark}
                disabled={!selectedSubject || !selectedDate || loading}
                fullWidth
              >
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {students.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Students ({students.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Enrollment Number</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.enrollmentNumber}</TableCell>
                      <TableCell>{student.userId?.name}</TableCell>
                      <TableCell>
                        {attendanceData[student._id] && (
                          <Chip
                            icon={getStatusIcon(attendanceData[student._id])}
                            label={attendanceData[student._id]}
                            color={getStatusColor(attendanceData[student._id])}
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          row
                          value={attendanceData[student._id] || ''}
                          onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                        >
                          <FormControlLabel
                            value="present"
                            control={<Radio color="success" />}
                            label="Present"
                          />
                          <FormControlLabel
                            value="absent"
                            control={<Radio color="error" />}
                            label="Absent"
                          />
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {students.length === 0 && selectedSubject && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No students enrolled in this subject
            </Typography>
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default Attendance;