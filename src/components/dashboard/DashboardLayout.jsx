import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

const DashboardLayout = ({ onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Mobile menu button */}
      <IconButton
        sx={{ 
          display: { xs: 'block', md: 'none' }, 
          position: 'fixed', 
          top: 16, 
          left: 16, 
          zIndex: 1100 
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>

      {/* Desktop Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigation}
        onLogout={onLogout}
      />

      {/* Main content */}
      <Box component="main" sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        minHeight: '100vh'
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;