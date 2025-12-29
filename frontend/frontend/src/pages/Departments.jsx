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
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { departmentAPI, facultyAPI, courseAPI, studentAPI } from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    hodName: '',
    hodEmail: '',
    establishedYear: '',
    location: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptsRes] = await Promise.all([
        departmentAPI.getDepartments(),
      ]);

      setDepartments(deptsRes.data.data);

      // Fetch statistics for each department
      const stats = {};
      for (const dept of deptsRes.data.data) {
        try {
          const [facultyRes, coursesRes, studentsRes] = await Promise.all([
            facultyAPI.getFaculty({ departmentId: dept._id }),
            courseAPI.getCourses({ departmentId: dept._id }),
            studentAPI.getStudents({ departmentId: dept._id }),
          ]);

          stats[dept._id] = {
            facultyCount: facultyRes.data.data.length,
            coursesCount: coursesRes.data.data.length,
            studentsCount: studentsRes.data.data.length,
          };
        } catch (err) {
          console.error(`Error fetching stats for department ${dept._id}:`, err);
          stats[dept._id] = { facultyCount: 0, coursesCount: 0, studentsCount: 0 };
        }
      }

      setDepartmentStats(stats);
    } catch (err) {
      setError('Failed to load departments data');
      console.error('Departments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    try {
      await departmentAPI.createDepartment(formData);
      setCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      setError('Failed to create department');
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      await departmentAPI.updateDepartment(selectedDepartment._id, formData);
      setEditDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      setError('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        await departmentAPI.deleteDepartment(departmentId);
        fetchData();
      } catch {
        setError('Failed to delete department');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      departmentName: '',
      departmentCode: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      hodName: '',
      hodEmail: '',
      establishedYear: '',
      location: '',
    });
    setSelectedDepartment(null);
  };

  const openEditDialog = (department) => {
    setSelectedDepartment(department);
    setFormData({
      departmentName: department.departmentName || '',
      departmentCode: department.departmentCode || '',
      description: department.description || '',
      contactEmail: department.contactEmail || '',
      contactPhone: department.contactPhone || '',
      hodName: department.hodName || '',
      hodEmail: department.hodEmail || '',
      establishedYear: department.establishedYear || '',
      location: department.location || '',
    });
    setEditDialogOpen(true);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.departmentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <BusinessIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Department Management
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
                Total Departments
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
                Total Faculty
              </Typography>
              <Typography variant="h4">
                {Object.values(departmentStats).reduce((sum, stats) => sum + stats.facultyCount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Courses
              </Typography>
              <Typography variant="h4">
                {Object.values(departmentStats).reduce((sum, stats) => sum + stats.coursesCount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">
                {Object.values(departmentStats).reduce((sum, stats) => sum + stats.studentsCount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <TextField
          placeholder="Search departments..."
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
          Add Department
        </Button>
      </Box>

      {/* Departments Grid */}
      <Grid container spacing={3}>
        {filteredDepartments.map((department) => {
          const stats = departmentStats[department._id] || { facultyCount: 0, coursesCount: 0, studentsCount: 0 };

          return (
            <Grid item xs={12} md={6} lg={4} key={department._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {department.departmentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {department.departmentCode}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {department.description}
                  </Typography>

                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.main' }}>
                          <PersonIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${stats.facultyCount} Faculty Members`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          <SchoolIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${stats.coursesCount} Courses`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                          <SchoolIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${stats.studentsCount} Students`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <EmailIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                        {department.contactEmail}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <PhoneIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                        {department.contactPhone}
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditDialog(department)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteDepartment(department._id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create Department Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Name"
                value={formData.departmentName}
                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Code"
                value={formData.departmentCode}
                onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HOD Name"
                value={formData.hodName}
                onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HOD Email"
                type="email"
                value={formData.hodEmail}
                onChange={(e) => setFormData({ ...formData, hodEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Established Year"
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateDepartment} variant="contained">Create Department</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Name"
                value={formData.departmentName}
                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department Code"
                value={formData.departmentCode}
                onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HOD Name"
                value={formData.hodName}
                onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HOD Email"
                type="email"
                value={formData.hodEmail}
                onChange={(e) => setFormData({ ...formData, hodEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Established Year"
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateDepartment} variant="contained">Update Department</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Departments;