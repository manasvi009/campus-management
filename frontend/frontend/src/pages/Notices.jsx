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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Announcement as AnnouncementIcon,
  Visibility as VisibilityIcon,
  PriorityHigh as PriorityIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { noticeAPI } from '../services/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    isActive: true,
    expiryDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [noticesRes, categoriesRes] = await Promise.all([
        noticeAPI.getNotices(),
        noticeAPI.getNoticeCategories(),
      ]);

      setNotices(noticesRes.data.data);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      setError('Failed to load notices data');
      console.error('Notices fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async () => {
    try {
      await noticeAPI.createNotice(formData);
      setCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to create notice');
    }
  };

  const handleUpdateNotice = async () => {
    try {
      await noticeAPI.updateNotice(selectedNotice._id, formData);
      setEditDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to update notice');
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await noticeAPI.deleteNotice(noticeId);
        fetchData();
      } catch (err) {
        setError('Failed to delete notice');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      priority: 'medium',
      isActive: true,
      expiryDate: '',
    });
    setSelectedNotice(null);
  };

  const openEditDialog = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title || '',
      content: notice.content || '',
      category: notice.category || '',
      priority: notice.priority || 'medium',
      isActive: notice.isActive !== false,
      expiryDate: notice.expiryDate ? notice.expiryDate.split('T')[0] : '',
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (notice) => {
    setSelectedNotice(notice);
    fetchData();
  };

  const filteredNotices = notices.filter(notice =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeNotices = filteredNotices.filter(notice => notice.isActive);
  const inactiveNotices = filteredNotices.filter(notice => !notice.isActive);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'academic':
        return 'primary';
      case 'administrative':
        return 'secondary';
      case 'events':
        return 'info';
      case 'examination':
        return 'warning';
      default:
        return 'default';
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        <AnnouncementIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Notice Management
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
                Total Notices
              </Typography>
              <Typography variant="h4">
                {notices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Notices
              </Typography>
              <Typography variant="h4" color="success.main">
                {activeNotices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h4">
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                High Priority
              </Typography>
              <Typography variant="h4" color="error.main">
                {notices.filter(n => n.priority === 'high').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <TextField
          placeholder="Search notices..."
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
          Post New Notice
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`All Notices (${notices.length})`} />
        <Tab label={`Active (${activeNotices.length})`} />
        <Tab label={`Inactive (${inactiveNotices.length})`} />
      </Tabs>

      {/* Notices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Posted By</strong></TableCell>
              <TableCell><strong>Posted Date</strong></TableCell>
              <TableCell><strong>Expiry Date</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(selectedTab === 0 ? filteredNotices :
              selectedTab === 1 ? activeNotices :
              inactiveNotices).map((notice) => (
              <TableRow key={notice._id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {notice.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {notice.content}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={notice.category || 'General'}
                    color={getCategoryColor(notice.category)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={notice.priority || 'Medium'}
                    color={getPriorityColor(notice.priority)}
                    size="small"
                    icon={notice.priority === 'high' ? <PriorityIcon /> : null}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={notice.isActive ? 'Active' : 'Inactive'}
                    color={notice.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{notice.postedBy?.name || 'Admin'}</TableCell>
                <TableCell>{new Date(notice.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {notice.expiryDate ? new Date(notice.expiryDate).toLocaleDateString() : 'No expiry'}
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton onClick={() => openViewDialog(notice)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => openEditDialog(notice)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteNotice(notice._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Notice Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Post New Notice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="administrative">Administrative</MenuItem>
                <MenuItem value="events">Events</MenuItem>
                <MenuItem value="examination">Examination</MenuItem>
                <MenuItem value="placements">Placements</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date (Optional)"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Content"
                multiline
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Enter the detailed notice content here..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNotice} variant="contained">Post Notice</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Notice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="administrative">Administrative</MenuItem>
                <MenuItem value="events">Events</MenuItem>
                <MenuItem value="examination">Examination</MenuItem>
                <MenuItem value="placements">Placements</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date (Optional)"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notice Content"
                multiline
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Enter the detailed notice content here..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateNotice} variant="contained">Update Notice</Button>
        </DialogActions>
      </Dialog>

      {/* View Notice Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{selectedNotice?.title}</Typography>
            <Box>
              <Chip
                label={selectedNotice?.category || 'General'}
                color={getCategoryColor(selectedNotice?.category)}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                label={selectedNotice?.priority || 'Medium'}
                color={getPriorityColor(selectedNotice?.priority)}
                size="small"
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Posted by: {selectedNotice?.postedBy?.name || 'Admin'} on {selectedNotice?.createdAt ? new Date(selectedNotice.createdAt).toLocaleDateString() : ''}
            </Typography>
            {selectedNotice?.expiryDate && (
              <Typography variant="body2" color="text.secondary">
                <CalendarIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                Expires on: {new Date(selectedNotice.expiryDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedNotice?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notices;