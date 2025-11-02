import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { menuItems } from './menuItems';

const NavigationList = ({ onLogout, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <List sx={{ p: 1 }}>
      {menuItems.map((item) => (
        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 2,
              mx: 1,
              transition: 'all 0.2s ease-in-out',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === item.path 
                  ? 'white' 
                  : 'rgba(255, 255, 255, 0.7)' 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 400
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
      
      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: 2,
            mx: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5',
              transform: 'translateX(4px)'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default NavigationList;