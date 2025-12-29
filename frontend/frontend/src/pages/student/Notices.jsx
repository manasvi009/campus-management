import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
} from '@mui/material';
import { Announcement as NoticeIcon, Person as PersonIcon, DateRange as DateIcon } from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, important, department, general

  useEffect(() => {
    fetchNotices();
  }, [filter, fetchNotices]);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await studentAPI.getStudentNotices(params);
      setNotices(response.data);
    } catch {
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, [filter]);

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
      case 'important':
        return 'error';
      case 'department':
        return 'primary';
      case 'general':
        return 'default';
      case 'academic':
        return 'info';
      case 'exam':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading notices...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Notices & Announcements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with important announcements and notices
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by Category"
          >
            <MenuItem value="all">All Notices</MenuItem>
            <MenuItem value="important">Important</MenuItem>
            <MenuItem value="department">Department</MenuItem>
            <MenuItem value="academic">Academic</MenuItem>
            <MenuItem value="exam">Examinations</MenuItem>
            <MenuItem value="general">General</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Notice Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NoticeIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{notices.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Notices
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
                <NoticeIcon sx={{ mr: 2, color: 'error.main' }} />
                <Box>
                  <Typography variant="h6">
                    {notices.filter(n => n.priority === 'high').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
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
                <DateIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">
                    {notices.filter(n => {
                      const noticeDate = new Date(n.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return noticeDate >= weekAgo;
                    }).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notices List */}
      <Paper sx={{ p: 3 }}>
        {notices.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No notices found for the selected category
          </Typography>
        ) : (
          <List>
            {notices.map((notice, index) => (
              <React.Fragment key={notice._id}>
                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 3 }}>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {notice.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                          color={getCategoryColor(notice.category)}
                          size="small"
                        />
                        <Chip
                          label={notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                          color={getPriorityColor(notice.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Posted by {notice.createdBy?.name || 'Admin'} on {formatDate(notice.createdAt)}
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {notice.content}
                    </Typography>

                    {notice.attachments && notice.attachments.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Attachments:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {notice.attachments.map((attachment, idx) => (
                            <Chip
                              key={idx}
                              label={attachment.filename}
                              size="small"
                              clickable
                              onClick={() => window.open(attachment.url, '_blank')}
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </ListItem>
                {index < notices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Notices;