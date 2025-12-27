import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Book as BookIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  Subject as SubjectIcon
} from '@mui/icons-material';
import { studentAPI } from '../../services/api';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState({
    subject: 'all',
    type: 'all',
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, [filter]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = {
        ...(filter.subject !== 'all' && { subjectId: filter.subject }),
        ...(filter.type !== 'all' && { materialType: filter.type }),
      };
      const response = await studentAPI.getStudyMaterials(params);
      setMaterials(response.data.materials || []);
      setSubjects(response.data.subjects || []);
    } catch (err) {
      setError('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (materialId, filename) => {
    try {
      setDownloading(materialId);
      setError('');
      setSuccess('');

      const response = await studentAPI.downloadStudyMaterial(materialId);

      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`Downloaded ${filename} successfully`);
    } catch (err) {
      setError('Failed to download material');
    } finally {
      setDownloading(null);
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'error';
      case 'doc':
      case 'docx':
        return 'primary';
      case 'ppt':
      case 'pptx':
        return 'warning';
      case 'xls':
      case 'xlsx':
        return 'success';
      case 'txt':
        return 'default';
      default:
        return 'default';
    }
  };

  const getMaterialTypeColor = (type) => {
    switch (type) {
      case 'notes':
        return 'primary';
      case 'assignment':
        return 'warning';
      case 'question_paper':
        return 'error';
      case 'reference':
        return 'success';
      case 'presentation':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading study materials...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Study Materials
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Download notes, assignments, and other study resources
          </Typography>
        </Box>
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

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Subject</InputLabel>
            <Select
              value={filter.subject}
              onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
              label="Filter by Subject"
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subjectCode} - {subject.subjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              label="Filter by Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="notes">Notes</MenuItem>
              <MenuItem value="assignment">Assignments</MenuItem>
              <MenuItem value="question_paper">Question Papers</MenuItem>
              <MenuItem value="reference">Reference Materials</MenuItem>
              <MenuItem value="presentation">Presentations</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">{materials.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Materials
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
                <DownloadIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">
                    {materials.filter(m => m.downloadCount > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Downloaded Items
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
                <SubjectIcon sx={{ mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography variant="h6">{subjects.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subjects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Materials Table */}
      <Paper sx={{ p: 3 }}>
        {materials.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No study materials found for the selected filters
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Uploaded By</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Downloads</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                          <BookIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {material.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(material.uploadDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {material.subjectId?.subjectCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {material.subjectId?.subjectName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={material.materialType.replace('_', ' ').toUpperCase()}
                        color={getMaterialTypeColor(material.materialType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {material.uploadedBy?.name || 'Unknown'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatFileSize(material.fileSize)}
                      </Typography>
                      <Chip
                        label={material.fileType.toUpperCase()}
                        color={getFileTypeColor(material.fileType)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {material.downloadCount || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(material._id, material.filename)}
                        disabled={downloading === material._id}
                      >
                        {downloading === material._id ? 'Downloading...' : 'Download'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default StudyMaterials;