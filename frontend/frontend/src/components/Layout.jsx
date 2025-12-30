import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Person,
  Business,
  Book,
  Assessment,
  Payment,
  Announcement,
  LibraryBooks,
  Work,
  Settings,
  Logout,
  AccountCircle,
  Schedule,
  Download,
  QuestionAnswer,
} from '@mui/icons-material';
import { useAuth } from '../utils/useAuth';

const drawerWidth = 240;

// Admin menu items
const adminMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Students', icon: <School />, path: '/dashboard/students' },
  { text: 'Faculty', icon: <Person />, path: '/dashboard/faculty' },
  { text: 'Departments', icon: <Business />, path: '/dashboard/departments' },
  { text: 'Courses', icon: <Book />, path: '/dashboard/courses' },
  { text: 'Attendance', icon: <Assessment />, path: '/dashboard/attendance' },
  { text: 'Results', icon: <Assessment />, path: '/dashboard/results' },
  { text: 'Fees', icon: <Payment />, path: '/dashboard/fees' },
  { text: 'Notices', icon: <Announcement />, path: '/dashboard/notices' },
  { text: 'Library', icon: <LibraryBooks />, path: '/dashboard/library' },
  { text: 'Placement', icon: <Work />, path: '/dashboard/placement' },
  { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
];

// Faculty menu items
const facultyMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'My Profile', icon: <AccountCircle />, path: '/dashboard/faculty-profile' },
  { text: 'Attendance', icon: <Assessment />, path: '/dashboard/attendance' },
  { text: 'Results', icon: <Assessment />, path: '/dashboard/results' },
  { text: 'Study Materials', icon: <LibraryBooks />, path: '/dashboard/study-materials' },
  { text: 'Notices', icon: <Announcement />, path: '/dashboard/notices' },
  { text: 'Queries', icon: <QuestionAnswer />, path: '/dashboard/faculty-queries' },
  { text: 'Timetable', icon: <Schedule />, path: '/dashboard/faculty-timetable' },
];

// Student menu items
const studentMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'My Profile', icon: <AccountCircle />, path: '/dashboard/profile' },
  { text: 'Course Enrollment', icon: <School />, path: '/dashboard/enrollment' },
  { text: 'Timetable', icon: <Schedule />, path: '/dashboard/timetable' },
  { text: 'Attendance', icon: <Assessment />, path: '/dashboard/attendance' },
  { text: 'Study Materials', icon: <Download />, path: '/dashboard/study-materials' },
  { text: 'Queries', icon: <QuestionAnswer />, path: '/dashboard/queries' },
  { text: 'Notices', icon: <Announcement />, path: '/dashboard/notices' },
  { text: 'Placement', icon: <Work />, path: '/dashboard/placement' },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  // Determine menu items based on user role
  const getMenuItems = () => {
    if (user?.role === 'student') return studentMenuItems;
    if (user?.role === 'faculty') return facultyMenuItems;
    return adminMenuItems; // Default to admin for admin and other roles
  };

  const menuItems = getMenuItems();

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Campus Management
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="primary-search-account-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2">{user?.name}</Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2" color="text.secondary">
                Role: {user?.role}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;