import { Box, Drawer } from '@mui/material';
import SidebarHeader from './SidebarHeader';
import NavigationList from './NavigationList';


const MobileSidebar = ({ open, onClose, onNavigate, onLogout }) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      sm={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
          color: 'white',
          width: 280
        }
      }}
    >
      <Box sx={{ width: 280 }}>
        <SidebarHeader />
        <NavigationList onLogout={onLogout} onNavigate={onNavigate} />
      </Box>
    </Drawer>
  );
};

export default MobileSidebar;