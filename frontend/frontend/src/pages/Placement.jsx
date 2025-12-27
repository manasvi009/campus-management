import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { studentAPI } from '../services/api';

const Placement = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [placementStats, setPlacementStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, statsResponse] = await Promise.all([
        studentAPI.getJobPostings(),
        studentAPI.getPlacementStats(),
      ]);

      setJobPostings(jobsResponse.data.data);
      setPlacementStats(statsResponse.data.data);
    } catch (err) {
      setError('Failed to load placement data');
      console.error('Error fetching placement data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    try {
      setApplying(true);
      await studentAPI.applyForJob(selectedJob._id);
      setApplyMessage('Application submitted successfully!');
      setApplyDialogOpen(false);
      setSelectedJob(null);
      // Refresh job postings to update application status
      fetchData();
    } catch (err) {
      setApplyMessage(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    } else if (min) {
      return `₹${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ₹${max.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time':
        return 'primary';
      case 'internship':
        return 'secondary';
      case 'part-time':
        return 'info';
      default:
        return 'default';
    }
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
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
        <WorkIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Placement Services
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Placement Statistics */}
      {placementStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WorkIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {placementStats.totalJobs}
                    </Typography>
                    <Typography variant="body2">
                      Active Job Postings
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BusinessIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {placementStats.companiesVisited}
                    </Typography>
                    <Typography variant="body2">
                      Companies Visited
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PersonIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {placementStats.placedStudents}
                    </Typography>
                    <Typography variant="body2">
                      Students Placed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {placementStats.averagePackage ? `₹${placementStats.averagePackage.toLocaleString()}` : 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Average Package
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Job Postings */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Available Job Opportunities
      </Typography>

      {jobPostings.length === 0 ? (
        <Alert severity="info">
          No active job postings available at the moment.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Job Title</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Salary Range</strong></TableCell>
                <TableCell><strong>Deadline</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobPostings.map((job) => (
                <TableRow key={job._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {job.jobTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.jobDescription?.substring(0, 100)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {job.companyName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                      {job.location}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CalendarIcon sx={{ mr: 1, color: isDeadlinePassed(job.applicationDeadline) ? 'error.main' : 'action.active' }} />
                      <Typography
                        variant="body2"
                        color={isDeadlinePassed(job.applicationDeadline) ? 'error' : 'text.primary'}
                      >
                        {formatDate(job.applicationDeadline)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={job.jobType || 'Full-time'}
                      color={getJobTypeColor(job.jobType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedJob(job);
                        setApplyDialogOpen(true);
                      }}
                      disabled={isDeadlinePassed(job.applicationDeadline)}
                      sx={{ mr: 1 }}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Job Details Dialog */}
      <Dialog
        open={!!selectedJob && !applyDialogOpen}
        onClose={() => setSelectedJob(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WorkIcon sx={{ mr: 2 }} />
            {selectedJob?.jobTitle}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Company Information
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    <Typography><strong>{selectedJob.companyName}</strong></Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <LocationIcon sx={{ mr: 1 }} />
                    <Typography>{selectedJob.location}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography>Posted by: {selectedJob.postedBy?.name || 'Admin'}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Job Details
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <MoneyIcon sx={{ mr: 1 }} />
                    <Typography>Salary: {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1 }} />
                    <Typography>Deadline: {formatDate(selectedJob.applicationDeadline)}</Typography>
                  </Box>
                  <Chip
                    label={selectedJob.jobType || 'Full-time'}
                    color={getJobTypeColor(selectedJob.jobType)}
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedJob.jobDescription}
              </Typography>

              {selectedJob.requirements && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedJob.requirements}
                  </Typography>
                </>
              )}

              {selectedJob.benefits && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Benefits
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedJob.benefits}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedJob(null)}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={() => setApplyDialogOpen(true)}
            variant="contained"
            disabled={selectedJob && isDeadlinePassed(selectedJob.applicationDeadline)}
          >
            Apply for this Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={() => !applying && setApplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Apply for {selectedJob?.jobTitle}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to apply for this position at {selectedJob?.companyName}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your application will be submitted and you will be notified of any updates.
          </Typography>

          {applyMessage && (
            <Alert
              severity={applyMessage.includes('success') ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {applyMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setApplyDialogOpen(false);
              setApplyMessage('');
            }}
            disabled={applying}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={applying}
            variant="contained"
            startIcon={applying ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {applying ? 'Submitting...' : 'Confirm Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Placement;