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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { CheckCircle as PresentIcon, Cancel as AbsentIcon, Schedule as PendingIcon } from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    attendancePercentage: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, [selectedSubject]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = selectedSubject ? { subjectId: selectedSubject } : {};
      const response = await studentAPI.getStudentAttendance(params);
      setAttendance(response.data.attendance || []);
      setSubjects(response.data.subjects || []);
      setStats(response.data.stats || stats);
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <PresentIcon sx={{ color: 'success.main' }} />;
      case 'absent':
        return <AbsentIcon sx={{ color: 'error.main' }} />;
      case 'pending':
        return <PendingIcon sx={{ color: 'warning.main' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading attendance...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Attendance Record
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your attendance across all subjects
          </Typography>
        </Box>

        {subjects.length > 1 && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              label="Filter by Subject"
            >
              <MenuItem value="">All Subjects</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subjectCode} - {subject.subjectName}
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

      {/* Attendance Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Overall Attendance
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {stats.attendancePercentage.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.attendancePercentage}
                color={getAttendanceColor(stats.attendancePercentage)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PresentIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">{stats.presentCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Present
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AbsentIcon sx={{ mr: 2, color: 'error.main' }} />
                <Box>
                  <Typography variant="h6">{stats.absentCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Absent
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PendingIcon sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">{stats.totalClasses - stats.presentCount - stats.absentCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Detailed Attendance Record
        </Typography>

        {attendance.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No attendance records found
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Marked By</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {record.subjectId?.subjectCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {record.subjectId?.subjectName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(record.status)}
                        <Chip
                          label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          color={getStatusColor(record.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {record.markedBy?.name || 'System'}
                    </TableCell>
                    <TableCell>
                      {record.remarks || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Subject-wise Summary */}
      {subjects.length > 0 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Subject-wise Attendance Summary
          </Typography>

          <Grid container spacing={2}>
            {subjects.map((subject) => {
              const subjectAttendance = attendance.filter(
                record => record.subjectId?._id === subject._id
              );
              const present = subjectAttendance.filter(r => r.status === 'present').length;
              const total = subjectAttendance.length;
              const percentage = total > 0 ? (present / total) * 100 : 0;

              return (
                <Grid item xs={12} md={6} lg={4} key={subject._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {subject.subjectCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {subject.subjectName}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          {present}/{total} classes
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={getAttendanceColor(percentage)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Attendance;