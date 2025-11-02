import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const SettingsPage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoPost: false,
    theme: 'light',
    language: 'en'
  });

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    const updatedUser = {
      ...currentUser,
      settings: settings
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    showSnackbar('Settings saved successfully');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          color: '#2d3748',
          fontWeight: 700,
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        Settings
      </Typography>

      <Card sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>
            Application Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
            Configure your PostNexus preferences
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#667eea',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#667eea'
                          }
                        }
                      }}
                    />
                  }
                  label="Email notifications"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#667eea',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#667eea'
                          }
                        }
                      }}
                    />
                  }
                  label="Push notifications"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                Posting Preferences
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoPost}
                      onChange={(e) => handleSettingChange('autoPost', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b'
                          }
                        }
                      }}
                    />
                  }
                  label="Auto-post generated content"
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                Appearance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  label="Theme"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)'
                      }
                    }
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </TextField>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                Language & Region
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  select
                  label="Language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)'
                      }
                    }
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="de">Deutsch</MenuItem>
                </TextField>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;