import React, { useState, useEffect } from 'react';
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
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { Reply as ReplyIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { facultyAPI } from '../../services/api';

const FacultyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, [statusFilter]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await facultyAPI.getAssignedQueries(params);
      setQueries(response.data || []);
    } catch (err) {
      setError('Failed to load queries');
      console.error('Queries error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setResponse(query.response || '');
    setDialogOpen(true);
  };

  const handleRespond = async () => {
    if (!response.trim()) {
      setError('Please enter a response');
      return;
    }

    try {
      await facultyAPI.respondToQuery(selectedQuery._id, {
        response: response,
        status: 'resolved'
      });

      setDialogOpen(false);
      setSelectedQuery(null);
      setResponse('');
      fetchQueries(); // Refresh the list
    } catch (err) {
      setError('Failed to submit response');
      console.error('Response error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Student Queries
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Queries</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Queries Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Query</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading queries...
                </TableCell>
              </TableRow>
            ) : queries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No queries found
                </TableCell>
              </TableRow>
            ) : (
              queries.map((query) => (
                <TableRow key={query._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {query.studentId?.userId?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {query.studentId?.enrollmentNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{query.subject}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {query.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(query.status)}
                      color={getStatusColor(query.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(query.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewQuery(query)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Response Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Query Details
        </DialogTitle>
        <DialogContent>
          {selectedQuery && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                From: {selectedQuery.studentId?.userId?.name} ({selectedQuery.studentId?.enrollmentNumber})
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subject: {selectedQuery.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {new Date(selectedQuery.createdAt).toLocaleString()}
              </Typography>

              <Paper sx={{ p: 2, my: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">
                  {selectedQuery.message}
                </Typography>
              </Paper>

              {selectedQuery.attachments && selectedQuery.attachments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attachments:
                  </Typography>
                  {selectedQuery.attachments.map((attachment, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      onClick={() => window.open(attachment.url, '_blank')}
                    >
                      {attachment.filename}
                    </Button>
                  ))}
                </Box>
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRespond}
            variant="contained"
            startIcon={<ReplyIcon />}
            disabled={!response.trim()}
          >
            Send Response
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FacultyQueries;