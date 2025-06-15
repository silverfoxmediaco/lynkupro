// client/src/features/leads/LeadsPage.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import LeadForm from './components/LeadForm';
import LeadQuickActions from './components/LeadQuickActions';
import './styles/Leads.css';

const LeadsPage = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Determine if we're on a detail page
  const isDetailPage = location.pathname.match(/^\/leads\/[^/]+$/);
  const isFormPage = location.pathname.includes('/new') || location.pathname.includes('/edit');
  
  // Extract current lead ID if on detail/edit page
  const getCurrentLeadId = () => {
    const match = location.pathname.match(/^\/leads\/([^/]+)/);
    return match && match[1] !== 'new' ? match[1] : null;
  };

  // Hide quick actions on form pages
  useEffect(() => {
    setShowQuickActions(!isFormPage);
  }, [isFormPage]);

  // Sidebar navigation items (for future enhancement)
  const sidebarItems = [
    { label: 'All Leads', path: '/leads', icon: <DashboardIcon /> },
    // Add more navigation items as needed
  ];

  const handleRefresh = () => {
    // This will trigger a refresh in the list view
    // The components using hooks will automatically refresh
    window.dispatchEvent(new Event('leads-refresh'));
  };

  return (
    <Box className="leads-page">
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          position: 'relative',
          animation: 'fadeIn 0.3s ease-in'
        }}
      >
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LeadList />} />
          <Route path="/new" element={<LeadForm />} />
          <Route path="/:id" element={<LeadDetail />} />
          <Route path="/:id/edit" element={<LeadForm />} />
        </Routes>

        {/* Quick Actions - Floating Action Button */}
        {showQuickActions && (
          <LeadQuickActions 
            onRefresh={handleRefresh}
            currentLeadId={getCurrentLeadId()}
            position={isMobile ? 'bottom-right' : 'bottom-right'}
          />
        )}

        {/* Mobile Navigation Drawer (if needed) */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => setMobileMenuOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {/* Add mobile menu items here if needed */}
            </Box>
          </Drawer>
        )}
      </Box>
    </Box>
  );
};

export default LeadsPage;