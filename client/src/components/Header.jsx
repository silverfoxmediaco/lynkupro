// client/src/components/Header.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'
import logo from '../assets/lynkuprologo.png'
import '../styles/Header.css'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { label: 'Product', path: '/product' },
    { label: 'Company', path: '/company' },
    { label: 'Integrations', path: '/integrations' },
    { label: 'Resources', path: '/resources' },
    { label: 'Support', path: '/support' }
  ]

  const drawer = (
    <Box className="mobile-menu">
      <Box className="mobile-menu-header">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Lynkupro" 
            style={{ height: '30px' }}
          />
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <List className="mobile-nav-list">
        {navItems.map((item) => (
          <ListItem key={item.label} className="mobile-nav-item">
            <Link 
              to={item.path} 
              className="mobile-nav-link"
              onClick={handleDrawerToggle}
              style={{ width: '100%' }}
            >
              <ListItemText primary={item.label} />
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box className="mobile-auth-buttons">
        <Button 
          variant="outlined" 
          fullWidth 
          className="mobile-login-button"
          onClick={handleDrawerToggle}
        >
          Login
        </Button>
        <Button 
          variant="contained" 
          fullWidth 
          className="mobile-signup-button"
          onClick={handleDrawerToggle}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" className="header" sx={{ backgroundColor: '#FFFFFF' }}>
        <Toolbar className="header-toolbar">
          <Link to="/" className="header-logo">
            <img 
              src={logo} 
              alt="Lynkupro" 
              style={{ height: '40px', marginRight: '10px' }}
            />
          </Link>
          
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Box className="nav-links">
                {navItems.map((item) => (
                  <Button 
                    key={item.label}
                    component={Link} 
                    to={item.path} 
                    className="nav-button"
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Box className="auth-buttons">
                <Button variant="outlined" className="login-button">
                  Login
                </Button>
                <Button variant="contained" className="signup-button">
                  Sign Up
                </Button>
              </Box>
            </>
          )}
          
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                className="mobile-menu-button"
                sx={{ color: '#013BDB' }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Header