import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Add as AddIcon,
  QuestionAnswer as QueryIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [queryDialog, setQueryDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
  });

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudentQueries();
      setQueries(response.data);
    } catch (err) {
      setError('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await studentAPI.submitQuery(formData);
      setSuccess('Query submitted successfully');
      setQueryDialog(false);
      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        description: '',
      });
      await fetchQueries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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
    switch (category) {
      case 'academic':
        return 'primary';
      case 'administrative':
        return 'secondary';
      case 'technical':
        return 'info';
      case 'facility':
        return 'warning';
      case 'other':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading queries...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Queries & Complaints
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit queries and track their resolution status
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setQueryDialog(true)}
        >
          Submit New Query
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

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <QueryIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{queries.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Queries
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
                <PriorityIcon sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">
                    {queries.filter(q => q.status === 'open').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Queries
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
                <QueryIcon sx={{ mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h6">
                    {queries.filter(q => q.status === 'in_progress').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
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
                <QueryIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">
                    {queries.filter(q => q.status === 'resolved').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Queries List */}
      <Paper sx={{ p: 3 }}>
        {queries.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No queries submitted yet. Click "Submit New Query" to get started.
          </Typography>
        ) : (
          <List>
            {queries.map((query, index) => (
              <React.Fragment key={query._id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 3,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                  onClick={() => setSelectedQuery(query)}
                >
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                          {query.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={query.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(query.status)}
                          size="small"
                        />
                        <Chip
                          label={query.priority.toUpperCase()}
                          color={getPriorityColor(query.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Chip
                        label={query.category.charAt(0).toUpperCase() + query.category.slice(1)}
                        color={getCategoryColor(query.category)}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Submitted on {formatDate(query.createdAt)}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {query.description.length > 200
                        ? `${query.description.substring(0, 200)}...`
                        : query.description
                      }
                    </Typography>

                    {query.response && (
                      <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Response from {query.respondedBy?.name || 'Admin'}:
                        </Typography>
                        <Typography variant="body2">
                          {query.response}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Responded on {formatDate(query.respondedAt)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                {index < queries.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Submit Query Dialog */}
      <Dialog open={queryDialog} onClose={() => setQueryDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmitQuery}>
          <DialogTitle>Submit New Query</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Query Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="academic">Academic</MenuItem>
                    <MenuItem value="administrative">Administrative</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="facility">Facility</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Please provide detailed description of your query or complaint..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQueryDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Query'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Query Details Dialog */}
      <Dialog
        open={!!selectedQuery}
        onClose={() => setSelectedQuery(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedQuery && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{selectedQuery.title}</Typography>
                <Chip
                  label={selectedQuery.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(selectedQuery.status)}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={selectedQuery.category.charAt(0).toUpperCase() + selectedQuery.category.slice(1)}
                    color={getCategoryColor(selectedQuery.category)}
                  />
                  <Chip
                    label={`Priority: ${selectedQuery.priority.toUpperCase()}`}
                    color={getPriorityColor(selectedQuery.priority)}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Submitted on {formatDate(selectedQuery.createdAt)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedQuery.description}
                </Typography>
              </Box>

              {selectedQuery.response && (
                <Box sx={{ bgcolor: 'success.light', p: 3, borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Response
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedQuery.response}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Responded by {selectedQuery.respondedBy?.name || 'Admin'} on {formatDate(selectedQuery.respondedAt)}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedQuery(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Queries;