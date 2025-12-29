import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Paper,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Academic Calendar states
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [calendarFile, setCalendarFile] = useState(null);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [calendarDescription, setCalendarDescription] = useState('');
  const [calendars, setCalendars] = useState([]);

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    sessionTimeout: 30,
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const response = await adminAPI.getCalendars();
      setCalendars(response.data.data || []);
      setLoading(false);
    } catch {
      console.error('Failed to load calendars');
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await adminAPI.updateSettings(systemSettings);
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCalendar = async () => {
    if (!calendarFile || !calendarTitle) {
      setError('Please select a file and enter a title');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', calendarFile);
      formData.append('title', calendarTitle);
      formData.append('description', calendarDescription);

      await adminAPI.uploadCalendar(formData);
      setCalendarDialogOpen(false);
      setCalendarFile(null);
      setCalendarTitle('');
      setCalendarDescription('');
      fetchCalendars();
      setSuccess('Calendar uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to upload calendar');
    }
  };

  const handleDeleteCalendar = async (calendarId) => {
    if (window.confirm('Are you sure you want to delete this calendar?')) {
      try {
        await adminAPI.deleteCalendar(calendarId);
        fetchCalendars();
        setSuccess('Calendar deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch {
        setError('Failed to delete calendar');
      }
    }
  };

  const handleDownloadCalendar = async (calendar) => {
    try {
      const response = await adminAPI.downloadCalendar(calendar._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', calendar.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError('Failed to download calendar');
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
        <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        System Settings & Configuration
      </Typography>

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

      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="General Settings" />
        <Tab label="Academic Calendar" />
        <Tab label="Security & Access" />
        <Tab label="Notifications" />
      </Tabs>

      {/* General Settings Tab */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="System Configuration" avatar={<StorageIcon />} />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                    />
                  }
                  label="Maintenance Mode"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.registrationEnabled}
                      onChange={(e) => setSystemSettings({ ...systemSettings, registrationEnabled: e.target.checked })}
                    />
                  }
                  label="Student Registration Enabled"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.autoBackup}
                      onChange={(e) => setSystemSettings({ ...systemSettings, autoBackup: e.target.checked })}
                    />
                  }
                  label="Automatic Database Backup"
                  sx={{ mb: 2, display: 'block' }}
                />
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: parseInt(e.target.value) })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Max File Upload Size (MB)"
                  type="number"
                  value={systemSettings.maxFileSize}
                  onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: parseInt(e.target.value) })}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="File Upload Settings" avatar={<UploadIcon />} />
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Allowed File Types
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {systemSettings.allowedFileTypes.map((type, index) => (
                    <Chip
                      key={index}
                      label={type.toUpperCase()}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      onDelete={() => {
                        const newTypes = systemSettings.allowedFileTypes.filter((_, i) => i !== index);
                        setSystemSettings({ ...systemSettings, allowedFileTypes: newTypes });
                      }}
                    />
                  ))}
                </Box>
                <TextField
                  fullWidth
                  label="Add File Type"
                  placeholder="e.g., pdf, jpg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const newType = e.target.value.trim().toLowerCase();
                      if (newType && !systemSettings.allowedFileTypes.includes(newType)) {
                        setSystemSettings({
                          ...systemSettings,
                          allowedFileTypes: [...systemSettings.allowedFileTypes, newType]
                        });
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Academic Calendar Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Academic Calendar Management"
                avatar={<CalendarIcon />}
                action={
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => setCalendarDialogOpen(true)}
                  >
                    Upload Calendar
                  </Button>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload and manage academic calendars for the institution. Students and faculty can download the latest calendar.
                </Typography>

                <List>
                  {calendars.map((calendar) => (
                    <ListItem key={calendar._id} divider>
                      <ListItemText
                        primary={calendar.title}
                        secondary={
                          <>
                            {calendar.description && `${calendar.description} • `}
                            Uploaded on {new Date(calendar.createdAt).toLocaleDateString()} •
                            {calendar.downloads || 0} downloads
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => handleDownloadCalendar(calendar)} title="Download">
                          <DownloadIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteCalendar(calendar._id)} color="error" title="Delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {calendars.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No calendars uploaded yet"
                        secondary="Upload your first academic calendar to get started"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Security & Access Tab */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Security Settings" avatar={<SecurityIcon />} />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.twoFactorAuth || false}
                      onChange={(e) => setSystemSettings({ ...systemSettings, twoFactorAuth: e.target.checked })}
                    />
                  }
                  label="Enable Two-Factor Authentication"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.passwordPolicy || true}
                      onChange={(e) => setSystemSettings({ ...systemSettings, passwordPolicy: e.target.checked })}
                    />
                  }
                  label="Enforce Strong Password Policy"
                  sx={{ mb: 2, display: 'block' }}
                />
                <TextField
                  fullWidth
                  label="Password Minimum Length"
                  type="number"
                  value={systemSettings.passwordMinLength || 8}
                  onChange={(e) => setSystemSettings({ ...systemSettings, passwordMinLength: parseInt(e.target.value) })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Login Attempts Before Lockout</InputLabel>
                  <Select
                    value={systemSettings.loginAttempts || 5}
                    onChange={(e) => setSystemSettings({ ...systemSettings, loginAttempts: e.target.value })}
                  >
                    <MenuItem value={3}>3 attempts</MenuItem>
                    <MenuItem value={5}>5 attempts</MenuItem>
                    <MenuItem value={10}>10 attempts</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Access Control" avatar={<PersonIcon />} />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.ipRestriction || false}
                      onChange={(e) => setSystemSettings({ ...systemSettings, ipRestriction: e.target.checked })}
                    />
                  }
                  label="Enable IP Address Restrictions"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.auditLogging || true}
                      onChange={(e) => setSystemSettings({ ...systemSettings, auditLogging: e.target.checked })}
                    />
                  }
                  label="Enable Audit Logging"
                  sx={{ mb: 2, display: 'block' }}
                />
                <TextField
                  fullWidth
                  label="Account Lockout Duration (minutes)"
                  type="number"
                  value={systemSettings.lockoutDuration || 30}
                  onChange={(e) => setSystemSettings({ ...systemSettings, lockoutDuration: parseInt(e.target.value) })}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Notifications Tab */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Notification Preferences" avatar={<NotificationsIcon />} />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.emailNotifications}
                      onChange={(e) => setSystemSettings({ ...systemSettings, emailNotifications: e.target.checked })}
                    />
                  }
                  label="Email Notifications"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.smsNotifications}
                      onChange={(e) => setSystemSettings({ ...systemSettings, smsNotifications: e.target.checked })}
                    />
                  }
                  label="SMS Notifications"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.pushNotifications || false}
                      onChange={(e) => setSystemSettings({ ...systemSettings, pushNotifications: e.target.checked })}
                    />
                  }
                  label="Push Notifications"
                  sx={{ mb: 2, display: 'block' }}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Notification Types
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.notifyNewRegistrations || true}
                      onChange={(e) => setSystemSettings({ ...systemSettings, notifyNewRegistrations: e.target.checked })}
                    />
                  }
                  label="New Student Registrations"
                  sx={{ mb: 1, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.notifyExamResults || true}
                      onChange={(e) => setSystemSettings({ ...systemSettings, notifyExamResults: e.target.checked })}
                    />
                  }
                  label="Exam Results Published"
                  sx={{ mb: 1, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.notifyFeeReminders || true}
                      onChange={(e) => setSystemSettings({ ...systemSettings, notifyFeeReminders: e.target.checked })}
                    />
                  }
                  label="Fee Payment Reminders"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Email Configuration" />
              <CardContent>
                <TextField
                  fullWidth
                  label="SMTP Server"
                  value={systemSettings.smtpServer || ''}
                  onChange={(e) => setSystemSettings({ ...systemSettings, smtpServer: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="SMTP Port"
                  type="number"
                  value={systemSettings.smtpPort || 587}
                  onChange={(e) => setSystemSettings({ ...systemSettings, smtpPort: parseInt(e.target.value) })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="From Email Address"
                  type="email"
                  value={systemSettings.fromEmail || ''}
                  onChange={(e) => setSystemSettings({ ...systemSettings, fromEmail: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.smtpAuth || true}
                      onChange={(e) => setSystemSettings({ ...systemSettings, smtpAuth: e.target.checked })}
                    />
                  }
                  label="SMTP Authentication Required"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Upload Calendar Dialog */}
      <Dialog open={calendarDialogOpen} onClose={() => setCalendarDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Academic Calendar</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Calendar Title"
            value={calendarTitle}
            onChange={(e) => setCalendarTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={3}
            value={calendarDescription}
            onChange={(e) => setCalendarDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            style={{ display: 'none' }}
            id="calendar-file"
            type="file"
            onChange={(e) => setCalendarFile(e.target.files[0])}
          />
          <label htmlFor="calendar-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              fullWidth
            >
              {calendarFile ? calendarFile.name : 'Select Calendar File'}
            </Button>
          </label>
          {calendarFile && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              File size: {(calendarFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalendarDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUploadCalendar} variant="contained" disabled={!calendarFile || !calendarTitle}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;