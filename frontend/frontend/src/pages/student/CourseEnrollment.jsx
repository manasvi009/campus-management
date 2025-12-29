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
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, School as SchoolIcon } from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const CourseEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enrollDialog, setEnrollDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchEnrollments();
    fetchAvailableSubjects();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await studentAPI.getStudentEnrollments();
      setEnrollments(response.data);
    } catch {
      setError('Failed to load enrollments');
    }
  };

  const fetchAvailableSubjects = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAvailableSubjects();
      setAvailableSubjects(response.data);
    } catch {
      setError('Failed to load available subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedSubject) return;

    setEnrolling(true);
    setError('');
    setSuccess('');

    try {
      await studentAPI.enrollInSubject({ subjectId: selectedSubject });
      setSuccess('Successfully enrolled in subject');
      setEnrollDialog(false);
      setSelectedSubject('');
      await fetchEnrollments();
      await fetchAvailableSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll in subject');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDropSubject = async (enrollmentId) => {
    try {
      await studentAPI.dropSubject(enrollmentId);
      setSuccess('Successfully dropped subject');
      await fetchEnrollments();
      await fetchAvailableSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to drop subject');
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'default';
    const gradeValue = grade.charAt(0);
    switch (gradeValue) {
      case 'A': return 'success';
      case 'B': return 'primary';
      case 'C': return 'warning';
      case 'D':
      case 'F': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading course enrollments...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Course Enrollment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your subject enrollments and view grades
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEnrollDialog(true)}
          disabled={availableSubjects.length === 0}
        >
          Enroll in Subject
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Enrollment Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{enrollments.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enrolled Subjects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">
                    {enrollments.filter(e => e.grade).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Subjects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">{availableSubjects.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Subjects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enrolled Subjects Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          My Enrolled Subjects
        </Typography>

        {enrollments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No subjects enrolled yet. Click "Enroll in Subject" to get started.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Academic Year</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment._id}>
                    <TableCell>{enrollment.subjectId?.subjectCode}</TableCell>
                    <TableCell>{enrollment.subjectId?.subjectName}</TableCell>
                    <TableCell>{enrollment.subjectId?.credits}</TableCell>
                    <TableCell>{enrollment.semester}</TableCell>
                    <TableCell>{enrollment.academicYear}</TableCell>
                    <TableCell>
                      {enrollment.grade ? (
                        <Chip
                          label={enrollment.grade}
                          color={getGradeColor(enrollment.grade)}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not graded
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={enrollment.status || 'Active'}
                        color={enrollment.status === 'completed' ? 'success' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {enrollment.status !== 'completed' && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDropSubject(enrollment._id)}
                        >
                          Drop
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Enroll Dialog */}
      <Dialog open={enrollDialog} onClose={() => setEnrollDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enroll in Subject</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              label="Select Subject"
            >
              {availableSubjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subjectCode} - {subject.subjectName} ({subject.credits} credits)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEnroll}
            variant="contained"
            disabled={!selectedSubject || enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseEnrollment;