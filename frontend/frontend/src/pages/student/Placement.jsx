import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  DateRange as DateIcon,
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const Placement = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [placementStats, setPlacementStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    try {
      setLoading(true);
      const [postingsResponse, statsResponse] = await Promise.all([
        studentAPI.getJobPostings(),
        studentAPI.getPlacementStats(),
      ]);
      setJobPostings(postingsResponse.data);
      setPlacementStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load placement data');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(true);
      await studentAPI.applyForJob(jobId);
      setSuccess('Application submitted successfully');
      await fetchPlacementData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max, currency = 'INR') => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'full-time':
        return 'primary';
      case 'part-time':
        return 'secondary';
      case 'internship':
        return 'info';
      case 'contract':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isApplicationOpen = (deadline) => {
    return new Date(deadline) > new Date();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading placement information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Placement & Career Services
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore job opportunities and track placement statistics
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Placement Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{placementStats.totalJobs || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Job Postings
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
                <BusinessIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">{placementStats.companiesVisited || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Companies Visited
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
                <PersonIcon sx={{ mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h6">{placementStats.placedStudents || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students Placed
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
                <SalaryIcon sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">
                    {placementStats.averagePackage ? `₹${placementStats.averagePackage}L` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Package
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job Postings */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Current Job Openings
        </Typography>

        {jobPostings.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No job postings available at the moment
          </Typography>
        ) : (
          <List>
            {jobPostings.map((job, index) => (
              <React.Fragment key={job._id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 3,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                  onClick={() => setSelectedJob(job)}
                >
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                          <BusinessIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                            {job.jobTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.companyName}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={job.jobType.replace('-', ' ').toUpperCase()}
                          color={getJobTypeColor(job.jobType)}
                          size="small"
                        />
                        {isApplicationOpen(job.applicationDeadline) ? (
                          <Chip label="OPEN" color="success" size="small" />
                        ) : (
                          <Chip label="CLOSED" color="error" size="small" />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SalaryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Deadline: {formatDate(job.applicationDeadline)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {job.description.length > 200
                        ? `${job.description.substring(0, 200)}...`
                        : job.description
                      }
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {job.requiredSkills?.length > 3 && (
                        <Chip
                          label={`+${job.requiredSkills.length - 3} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </ListItem>
                {index < jobPostings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Job Details Dialog */}
      <Dialog
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedJob && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedJob.jobTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedJob.companyName}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Job Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedJob.description}
                    </Typography>

                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Requirements
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedJob.requirements}
                    </Typography>

                    {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                      <>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Required Skills
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                          {selectedJob.requiredSkills.map((skill, idx) => (
                            <Chip key={idx} label={skill} />
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Job Details
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {selectedJob.jobType.replace('-', ' ').toUpperCase()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedJob.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SalaryIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DateIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Deadline: {formatDate(selectedJob.applicationDeadline)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedJob(null)}>Close</Button>
              {isApplicationOpen(selectedJob.applicationDeadline) && (
                <Button
                  variant="contained"
                  onClick={() => handleApply(selectedJob._id)}
                  disabled={applying}
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Placement;