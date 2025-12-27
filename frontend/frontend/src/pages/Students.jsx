import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { studentAPI, departmentAPI, courseAPI } from '../services/api';
import { useAuth } from '../utils/useAuth';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    userId: '',
    enrollmentNumber: '',
    rollNumber: '',
    departmentId: '',
    courseId: '',
    semester: '',
    admissionYear: '',
    academicStatus: 'active',
    guardianName: '',
    guardianPhone: '',
    hostelAllocated: false,
    transportAllocated: false,
  });

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchCourses();
  }, [fetchStudents, fetchDepartments, fetchCourses]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await studentAPI.getStudents();
      setStudents(response.data.data);
    } catch {
      showSnackbar('Error fetching students', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentAPI.getDepartments();
      setDepartments(response.data.data);
    } catch {
      console.error('Error fetching departments');
      showSnackbar('Error fetching departments', 'error');
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getCourses();
      setCourses(response.data.data);
    } catch {
      console.error('Error fetching courses');
      showSnackbar('Error fetching courses', 'error');
    }
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        userId: student.userId?._id || '',
        enrollmentNumber: student.enrollmentNumber || '',
        rollNumber: student.rollNumber || '',
        departmentId: student.departmentId?._id || '',
        courseId: student.courseId?._id || '',
        semester: student.semester || '',
        admissionYear: student.admissionYear || '',
        academicStatus: student.academicStatus || 'active',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        hostelAllocated: student.hostelAllocated || false,
        transportAllocated: student.transportAllocated || false,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        userId: '',
        enrollmentNumber: '',
        rollNumber: '',
        departmentId: '',
        courseId: '',
        semester: '',
        admissionYear: '',
        academicStatus: 'active',
        guardianName: '',
        guardianPhone: '',
        hostelAllocated: false,
        transportAllocated: false,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent._id, formData);
        showSnackbar('Student updated successfully');
      } else {
        await studentAPI.createStudent(formData);
        showSnackbar('Student created successfully');
      }
      fetchStudents();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving student', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        showSnackbar('Student deleted successfully');
        fetchStudents();
      } catch {
        showSnackbar('Error deleting student', 'error');
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'graduated': return 'info';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Students Management
        </Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Student
          </Button>
        )}
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name, enrollment number, or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Enrollment Number</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.userId?.name || 'N/A'}</TableCell>
                  <TableCell>{student.enrollmentNumber}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.departmentId?.departmentName || 'N/A'}</TableCell>
                  <TableCell>{student.courseId?.courseName || 'N/A'}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.academicStatus}
                      color={getStatusColor(student.academicStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(student)}
                    >
                      <EditIcon />
                    </IconButton>
                    {user?.role === 'admin' && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(student._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Student Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="User ID"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                fullWidth
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Enrollment Number"
                  value={formData.enrollmentNumber}
                  onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Roll Number"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                  fullWidth
                />
              </Box>
              <Box display="flex" gap={2}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.departmentName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  >
                    {courses
                      .filter(course => course.departmentId === formData.departmentId)
                      .map((course) => (
                        <MenuItem key={course._id} value={course._id}>
                          {course.courseName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" gap={2}>
                <TextField
                  label="Semester"
                  type="number"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                  fullWidth
                  inputProps={{ min: 1, max: 8 }}
                />
                <TextField
                  label="Admission Year"
                  type="number"
                  value={formData.admissionYear}
                  onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                  required
                  fullWidth
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel>Academic Status</InputLabel>
                <Select
                  value={formData.academicStatus}
                  onChange={(e) => setFormData({ ...formData, academicStatus: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="graduated">Graduated</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" gap={2}>
                <TextField
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Guardian Phone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  fullWidth
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingStudent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;