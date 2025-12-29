import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  LibraryBooks as LibraryIcon,
} from '@mui/icons-material';
import { courseAPI, departmentAPI, subjectAPI } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Dialog states
  const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState(false);
  const [editCourseDialogOpen, setEditCourseDialogOpen] = useState(false);
  const [createSubjectDialogOpen, setCreateSubjectDialogOpen] = useState(false);
  const [editSubjectDialogOpen, setEditSubjectDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [courseFormData, setCourseFormData] = useState({
    courseName: '',
    courseCode: '',
    departmentId: '',
    duration: '',
    totalSemesters: '',
    courseType: '',
    description: '',
  });

  const [subjectFormData, setSubjectFormData] = useState({
    subjectName: '',
    subjectCode: '',
    courseId: '',
    semester: '',
    credits: '',
    subjectType: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, subjectsRes, deptsRes] = await Promise.all([
        courseAPI.getCourses(),
        subjectAPI.getSubjects ? subjectAPI.getSubjects() : Promise.resolve({ data: { data: [] } }),
        departmentAPI.getDepartments(),
      ]);

      setCourses(coursesRes.data.data);
      setSubjects(subjectsRes.data.data || []);
      setDepartments(deptsRes.data.data);
    } catch (err) {
      setError('Failed to load courses and subjects data');
      console.error('Courses fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      await courseAPI.createCourse(courseFormData);
      setCreateCourseDialogOpen(false);
      resetCourseForm();
      fetchData();
    } catch {
      setError('Failed to create course');
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await courseAPI.updateCourse(selectedCourse._id, courseFormData);
      setEditCourseDialogOpen(false);
      resetCourseForm();
      fetchData();
    } catch {
      setError('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated subjects.')) {
      try {
        await courseAPI.deleteCourse(courseId);
        fetchData();
      } catch {
        setError('Failed to delete course');
      }
    }
  };

  const handleCreateSubject = async () => {
    try {
      // This would need a backend endpoint for creating subjects
      // For now, we'll just show a success message
      console.log('Creating subject:', subjectFormData);
      setCreateSubjectDialogOpen(false);
      resetSubjectForm();
      // fetchData(); // Uncomment when backend is ready
    } catch {
      setError('Failed to create subject');
    }
  };

  const handleUpdateSubject = async () => {
    try {
      // This would need a backend endpoint for updating subjects
      console.log('Updating subject:', selectedSubject._id, subjectFormData);
      setEditSubjectDialogOpen(false);
      resetSubjectForm();
      // fetchData(); // Uncomment when backend is ready
    } catch {
      setError('Failed to update subject');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        // This would need a backend endpoint for deleting subjects
        console.log('Deleting subject:', subjectId);
        // fetchData(); // Uncomment when backend is ready
      } catch {
        setError('Failed to delete subject');
      }
    }
  };

  const resetCourseForm = () => {
    setCourseFormData({
      courseName: '',
      courseCode: '',
      departmentId: '',
      duration: '',
      totalSemesters: '',
      courseType: '',
      description: '',
    });
    setSelectedCourse(null);
  };

  const resetSubjectForm = () => {
    setSubjectFormData({
      subjectName: '',
      subjectCode: '',
      courseId: '',
      semester: '',
      credits: '',
      subjectType: '',
      description: '',
    });
    setSelectedSubject(null);
  };

  const openEditCourseDialog = (course) => {
    setSelectedCourse(course);
    setCourseFormData({
      courseName: course.courseName || '',
      courseCode: course.courseCode || '',
      departmentId: course.departmentId?._id || '',
      duration: course.duration || '',
      totalSemesters: course.totalSemesters || '',
      courseType: course.courseType || '',
      description: course.description || '',
    });
    setEditCourseDialogOpen(true);
  };

  const openEditSubjectDialog = (subject) => {
    setSelectedSubject(subject);
    setSubjectFormData({
      subjectName: subject.subjectName || '',
      subjectCode: subject.subjectCode || '',
      courseId: subject.courseId?._id || '',
      semester: subject.semester || '',
      credits: subject.credits || '',
      subjectType: subject.subjectType || '',
      description: subject.description || '',
    });
    setEditSubjectDialogOpen(true);
  };

  const filteredCourses = courses.filter(course =>
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        <BookIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Courses & Subjects Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Courses
              </Typography>
              <Typography variant="h4">
                {courses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Subjects
              </Typography>
              <Typography variant="h4">
                {subjects.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Departments
              </Typography>
              <Typography variant="h4">
                {departments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Courses
              </Typography>
              <Typography variant="h4" color="success.main">
                {courses.filter(c => c.isActive !== false).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <TextField
          placeholder="Search courses/subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateSubjectDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Add Subject
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateCourseDialogOpen(true)}
          >
            Add Course
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`Courses (${courses.length})`} />
        <Tab label={`Subjects (${subjects.length})`} />
      </Tabs>

      {/* Courses Table */}
      {selectedTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Course Name</strong></TableCell>
                <TableCell><strong>Course Code</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Duration</strong></TableCell>
                <TableCell><strong>Semesters</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course._id} hover>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.courseCode}</TableCell>
                  <TableCell>{course.departmentId?.departmentName}</TableCell>
                  <TableCell>{course.duration} years</TableCell>
                  <TableCell>{course.totalSemesters}</TableCell>
                  <TableCell>
                    <Chip
                      label={course.courseType || 'UG'}
                      color={course.courseType === 'PG' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => openEditCourseDialog(course)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteCourse(course._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Subjects Table */}
      {selectedTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Subject Name</strong></TableCell>
                <TableCell><strong>Subject Code</strong></TableCell>
                <TableCell><strong>Course</strong></TableCell>
                <TableCell><strong>Semester</strong></TableCell>
                <TableCell><strong>Credits</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject._id} hover>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell>{subject.subjectCode}</TableCell>
                  <TableCell>{subject.courseId?.courseName}</TableCell>
                  <TableCell>{subject.semester}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>
                    <Chip
                      label={subject.subjectType || 'Theory'}
                      color={subject.subjectType === 'Practical' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => openEditSubjectDialog(subject)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteSubject(subject._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Course Dialog */}
      <Dialog open={createCourseDialogOpen} onClose={() => setCreateCourseDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Name"
                value={courseFormData.courseName}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Code"
                value={courseFormData.courseCode}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={courseFormData.departmentId}
                onChange={(e) => setCourseFormData({ ...courseFormData, departmentId: e.target.value })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (years)"
                type="number"
                value={courseFormData.duration}
                onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Semesters"
                type="number"
                value={courseFormData.totalSemesters}
                onChange={(e) => setCourseFormData({ ...courseFormData, totalSemesters: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Course Type"
                value={courseFormData.courseType}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseType: e.target.value })}
              >
                <MenuItem value="UG">Undergraduate</MenuItem>
                <MenuItem value="PG">Postgraduate</MenuItem>
                <MenuItem value="Diploma">Diploma</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCourseDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCourse} variant="contained">Create Course</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={editCourseDialogOpen} onClose={() => setEditCourseDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Name"
                value={courseFormData.courseName}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Code"
                value={courseFormData.courseCode}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={courseFormData.departmentId}
                onChange={(e) => setCourseFormData({ ...courseFormData, departmentId: e.target.value })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (years)"
                type="number"
                value={courseFormData.duration}
                onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Semesters"
                type="number"
                value={courseFormData.totalSemesters}
                onChange={(e) => setCourseFormData({ ...courseFormData, totalSemesters: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Course Type"
                value={courseFormData.courseType}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseType: e.target.value })}
              >
                <MenuItem value="UG">Undergraduate</MenuItem>
                <MenuItem value="PG">Postgraduate</MenuItem>
                <MenuItem value="Diploma">Diploma</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCourseDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateCourse} variant="contained">Update Course</Button>
        </DialogActions>
      </Dialog>

      {/* Create Subject Dialog */}
      <Dialog open={createSubjectDialogOpen} onClose={() => setCreateSubjectDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject Name"
                value={subjectFormData.subjectName}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, subjectName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject Code"
                value={subjectFormData.subjectCode}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, subjectCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Course"
                value={subjectFormData.courseId}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, courseId: e.target.value })}
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Semester"
                type="number"
                value={subjectFormData.semester}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, semester: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={subjectFormData.credits}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Subject Type"
                value={subjectFormData.subjectType}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, subjectType: e.target.value })}
              >
                <MenuItem value="Theory">Theory</MenuItem>
                <MenuItem value="Practical">Practical</MenuItem>
                <MenuItem value="Lab">Lab</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={subjectFormData.description}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateSubjectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSubject} variant="contained">Create Subject</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={editSubjectDialogOpen} onClose={() => setEditSubjectDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject Name"
                value={subjectFormData.subjectName}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, subjectName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject Code"
                value={subjectFormData.subjectCode}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, subjectCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Course"
                value={subjectFormData.courseId}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, courseId: e.target.value })}
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Semester"
                type="number"
                value={subjectFormData.semester}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, semester: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={subjectFormData.credits}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Subject Type"
                value={subjectFormData.subjectType}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, subjectType: e.target.value })}
              >
                <MenuItem value="Theory">Theory</MenuItem>
                <MenuItem value="Practical">Practical</MenuItem>
                <MenuItem value="Lab">Lab</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={subjectFormData.description}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSubjectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateSubject} variant="contained">Update Subject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;