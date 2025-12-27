import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Student Management',
      description: 'Comprehensive student information system with enrollment, attendance, and academic tracking.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Faculty Management',
      description: 'Manage faculty profiles, schedules, and performance with ease.'
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Department Control',
      description: 'Organize and manage academic departments and their resources efficiently.'
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Academic Analytics',
      description: 'Generate reports and analytics for better decision making and insights.'
    }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'black' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <SchoolIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Campus Management System
            </Typography>

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                  >
                    {item.text}
                  </Button>
                ))}
                {user ? (
                  <Button
                    variant="contained"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<LoginIcon />}
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={() => navigate('/register')}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Campus Management System
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Streamline your educational institution with our comprehensive management solution
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            About Our System
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
            Our Campus Management System provides a complete solution for educational institutions.
            From student enrollment to faculty management, exam scheduling to result processing,
            we offer everything you need to run your campus efficiently.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Campus Management System
              </Typography>
              <Typography variant="body2">
                Empowering educational institutions with modern management solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" component="div">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Support</div>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2">
                Email: support@campusmgmt.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Education St, Learning City
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" textAlign="center" sx={{ mt: 4, pt: 2, borderTop: '1px solid #555' }}>
            © 2024 Campus Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;