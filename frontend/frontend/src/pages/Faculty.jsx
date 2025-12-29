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
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { facultyAPI, departmentAPI, subjectAPI } from '../services/api';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    departmentId: '',
    designation: '',
    qualification: '',
    experience: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    joiningDate: '',
  });
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facultyRes, deptsRes, subjectsRes] = await Promise.all([
        facultyAPI.getFaculty(),
        departmentAPI.getDepartments(),
        subjectAPI.getSubjects ? subjectAPI.getSubjects() : Promise.resolve({ data: { data: [] } }),
      ]);

      setFaculty(facultyRes.data.data);
      setDepartments(deptsRes.data.data);
      setSubjects(subjectsRes.data.data || []);
    } catch (err) {
      setError('Failed to load faculty data');
      console.error('Faculty fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaculty = async () => {
    try {
      await facultyAPI.createFaculty(formData);
      setCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      setError('Failed to create faculty');
    }
  };

  const handleUpdateFaculty = async () => {
    try {
      await facultyAPI.updateFaculty(selectedFaculty._id, formData);
      setEditDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      setError('Failed to update faculty');
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await facultyAPI.deleteFaculty(facultyId);
        fetchData();
      } catch {
        setError('Failed to delete faculty');
      }
    }
  };

  const handleAssignSubject = async (subjectId) => {
    try {
      // This would need a backend endpoint for assigning subjects to faculty
      // For now, we'll just update the local state
      setAssignedSubjects([...assignedSubjects, subjects.find(s => s._id === subjectId)]);
      setAvailableSubjects(availableSubjects.filter(s => s._id !== subjectId));
    } catch {
      setError('Failed to assign subject');
    }
  };

  const handleRemoveSubject = async (subjectId) => {
    try {
      setAvailableSubjects([...availableSubjects, assignedSubjects.find(s => s._id === subjectId)]);
      setAssignedSubjects(assignedSubjects.filter(s => s._id !== subjectId));
    } catch {
      setError('Failed to remove subject');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      employeeId: '',
      departmentId: '',
      designation: '',
      qualification: '',
      experience: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      joiningDate: '',
    });
    setSelectedFaculty(null);
    setAssignedSubjects([]);
    setAvailableSubjects([]);
  };

  const openEditDialog = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setFormData({
      name: facultyMember.userId?.name || '',
      email: facultyMember.userId?.email || '',
      employeeId: facultyMember.employeeId || '',
      departmentId: facultyMember.departmentId?._id || '',
      designation: facultyMember.designation || '',
      qualification: facultyMember.qualification || '',
      experience: facultyMember.experience || '',
      phone: facultyMember.phone || '',
      address: facultyMember.address || '',
      dateOfBirth: facultyMember.dateOfBirth ? facultyMember.dateOfBirth.split('T')[0] : '',
      gender: facultyMember.gender || '',
      joiningDate: facultyMember.joiningDate ? facultyMember.joiningDate.split('T')[0] : '',
    });
    setEditDialogOpen(true);
  };

  const openAssignDialog = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    // Mock assigned subjects - in real app, fetch from API
    setAssignedSubjects(facultyMember.assignedSubjects || []);
    setAvailableSubjects(subjects.filter(s => !facultyMember.assignedSubjects?.some(as => as._id === s._id)));
    setAssignDialogOpen(true);
  };

  const filteredFaculty = faculty.filter(facultyMember =>
    facultyMember.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facultyMember.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facultyMember.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <PersonIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Faculty Management
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
                Total Faculty
              </Typography>
              <Typography variant="h4">
                {faculty.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Faculty
              </Typography>
              <Typography variant="h4" color="success.main">
                {faculty.filter(f => f.isActive).length}
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
                Total Subjects
              </Typography>
              <Typography variant="h4">
                {subjects.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <TextField
          placeholder="Search faculty..."
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Faculty
        </Button>
      </Box>

      {/* Faculty Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Employee ID</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Designation</strong></TableCell>
              <TableCell><strong>Qualification</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFaculty.map((facultyMember) => (
              <TableRow key={facultyMember._id} hover>
                <TableCell>{facultyMember.userId?.name}</TableCell>
                <TableCell>{facultyMember.employeeId}</TableCell>
                <TableCell>{facultyMember.userId?.email}</TableCell>
                <TableCell>{facultyMember.departmentId?.departmentName}</TableCell>
                <TableCell>{facultyMember.designation}</TableCell>
                <TableCell>{facultyMember.qualification}</TableCell>
                <TableCell>
                  <Chip
                    label={facultyMember.isActive ? 'Active' : 'Inactive'}
                    color={facultyMember.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => openEditDialog(facultyMember)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Assign Subjects">
                    <IconButton onClick={() => openAssignDialog(facultyMember)} color="primary">
                      <AssignmentIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteFaculty(facultyMember._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Faculty Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Faculty</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
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
                label="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateFaculty} variant="contained">Create Faculty</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Faculty Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Faculty</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
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
                label="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateFaculty} variant="contained">Update Faculty</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Subjects Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assign Subjects to {selectedFaculty?.userId?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Assigned Subjects
              </Typography>
              <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1, minHeight: 200 }}>
                {assignedSubjects.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No subjects assigned" />
                  </ListItem>
                ) : (
                  assignedSubjects.map((subject) => (
                    <ListItem key={subject._id}>
                      <ListItemText primary={subject.subjectName} secondary={subject.subjectCode} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveSubject(subject._id)}
                          color="error"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Available Subjects
              </Typography>
              <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1, minHeight: 200 }}>
                {availableSubjects.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No subjects available" />
                  </ListItem>
                ) : (
                  availableSubjects.map((subject) => (
                    <ListItem key={subject._id}>
                      <ListItemText primary={subject.subjectName} secondary={subject.subjectCode} />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          onClick={() => handleAssignSubject(subject._id)}
                          variant="outlined"
                        >
                          Assign
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Faculty;