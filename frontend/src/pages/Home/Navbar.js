import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  FitnessCenter as FitnessCenterIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; // Adjust import path as needed

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // User menu state
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
    handleCloseUserMenu();
  };
  
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Pages for navigation links
  const pages = [
    { title: 'Home', path: '/', icon: <DashboardIcon /> },
    { title: 'Programs', path: '/programs', icon: <FitnessCenterIcon /> },
    { title: 'Schedule', path: '/schedule', icon: <CalendarIcon /> }
  ];
  
  // Settings menu items when logged in
  const settings = [
    { title: 'Profile', path: '/profile', icon: <PersonIcon /> },
    { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { title: 'Logout', action: handleLogout, icon: <LogoutIcon /> }
  ];

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          bgcolor: 'primary.dark',
          color: 'white'
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" component="div">
          FitnessPro
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {pages.map((page) => (
          <ListItem 
            button 
            key={page.title}
            component={RouterLink}
            to={page.path}
            sx={{ py: 1 }}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        {user ? (
          settings.map((item) => (
            <ListItem 
              button 
              key={item.title}
              component={item.path ? RouterLink : 'div'}
              to={item.path}
              onClick={item.action}
              sx={{ py: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))
        ) : (
          <>
            <ListItem 
              button 
              component={RouterLink}
              to="/login"
              sx={{ py: 1 }}
            >
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem 
              button 
              component={RouterLink}
              to="/register"
              sx={{ py: 1 }}
            >
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and hamburger menu for mobile */}
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : null}
          
          {/* Logo */}
          <FitnessCenterIcon sx={{ display: { xs: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FitnessPro
          </Typography>
          
          {/* Desktop navigation links */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {pages.map((page) => (
                <Button
                  key={page.title}
                  component={RouterLink}
                  to={page.path}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'block',
                    mx: 1
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          )}
          
          {/* User menu or auth buttons */}
          <Box sx={{ flexGrow: 0, ml: 'auto' }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user.name || 'User'} 
                      src={user.avatar || '/static/images/avatar/2.jpg'} 
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem 
                      key={setting.title} 
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting.action) {
                          setting.action();
                        } else if (setting.path) {
                          navigate(setting.path);
                        }
                      }}
                    >
                      <ListItemIcon>{setting.icon}</ListItemIcon>
                      <Typography textAlign="center">{setting.title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              !isMobile && (
                <Box sx={{ display: 'flex' }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ color: 'white', mr: 1 }}
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;