import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const SocialPage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [socialDialog, setSocialDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('currentUser');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success) {
      showSnackbar(success, 'success');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh user data to show connected account
      fetchUserData();
    } else if (error) {
      showSnackbar(decodeURIComponent(error), 'error');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchUserData();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const refreshProfile = async () => {
    const profileData = await apiService.getProfile();
    setCurrentUser(profileData.user);
    localStorage.setItem('currentUser', JSON.stringify(profileData.user));
  };

  const handleSocialConnect = async (platform) => {
    try {
      if (platform === 'linkedin' || platform === 'twitter') {
        // Initiate OAuth flow for LinkedIn or Twitter
        const authResponse = await apiService.initiateSocialAuth(platform);
        // Redirect to OAuth URL
        window.location.href = authResponse.authUrl;
      } else {
        // For other platforms (when implemented), use direct connection
        showSnackbar(`${platform} connection not yet implemented`, 'warning');
      }
    } catch (error) {
      console.error('Failed to initiate social auth:', error);
      showSnackbar(`Failed to connect ${platform}`, 'error');
    }
  };

  const handleSocialDisconnect = async (platform) => {
    try {
      await apiService.disconnectSocial(platform);
      await refreshProfile();
      showSnackbar(`${platform} disconnected`, 'success');
    } catch (error) {
      console.error('Failed to disconnect social account:', error);
      showSnackbar(`Failed to disconnect ${platform}`, 'error');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

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
        Social Accounts
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
            Connected Social Accounts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
            Connect your social media accounts to start automated posting
          </Typography>

          <Grid container spacing={3}>
            {[
              { platform: 'linkedin', icon: <LinkedInIcon />, name: 'LinkedIn', color: '#0077b5', gradient: 'linear-gradient(135deg, #0077b5 0%, #005885 100%)', available: true },
              { platform: 'twitter', icon: <TwitterIcon />, name: 'Twitter', color: '#1da1f2', gradient: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)', available: true },
              { platform: 'facebook', icon: <FacebookIcon />, name: 'Facebook', color: '#1877f2', gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5bd7 100%)', available: false }
            ].map(({ platform, icon, name, color, gradient, available }) => (
              <Grid item xs={12} sm={4} key={platform}>
                <Card variant="outlined" sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{
                      bgcolor: gradient,
                      mr: 2,
                      width: 50,
                      height: 50,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      {icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>{name}</Typography>
                  </Box>
                  {currentUser.socialConnections?.[platform]?.connected ? (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        label="Connected"
                        color="success"
                        sx={{
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white'
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleSocialDisconnect(platform)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Disconnect
                      </Button>
                    </Box>
                  ) : available ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleSocialConnect(platform)}
                      sx={{
                        background: gradient,
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      Connect
                    </Button>
                  ) : (
                    <Chip
                      label="Coming Soon"
                      sx={{
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white'
                      }}
                    />
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Social Connection Dialog */}
      <Dialog
        open={socialDialog}
        onClose={() => setSocialDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          borderRadius: '12px 12px 0 0'
        }}>
          Connect Social Accounts
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
            Connect your social media accounts to enable automated posting
          </Typography>

          <Grid container spacing={3}>
            {[
              { platform: 'linkedin', icon: <LinkedInIcon />, name: 'LinkedIn', color: '#0077b5', gradient: 'linear-gradient(135deg, #0077b5 0%, #005885 100%)', available: true },
              { platform: 'twitter', icon: <TwitterIcon />, name: 'Twitter', color: '#1da1f2', gradient: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)', available: true },
              { platform: 'facebook', icon: <FacebookIcon />, name: 'Facebook', color: '#1877f2', gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5bd7 100%)', available: false }
            ].map(({ platform, icon, name, color, gradient, available }) => (
              <Grid item xs={12} key={platform}>
                <Card variant="outlined" sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{
                        bgcolor: gradient,
                        mr: 3,
                        width: 50,
                        height: 50,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        {icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>{name}</Typography>
                    </Box>
                    {currentUser.socialConnections?.[platform]?.connected ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip
                          label="Connected"
                          color="success"
                          sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            color: 'white'
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleSocialDisconnect(platform)}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Disconnect
                        </Button>
                      </Box>
                    ) : available ? (
                      <Button
                        variant="contained"
                        onClick={() => handleSocialConnect(platform)}
                        sx={{
                          background: gradient,
                          borderRadius: 2,
                          px: 3,
                          fontWeight: 600,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                      >
                        Connect
                      </Button>
                    ) : (
                      <Chip
                        label="Coming Soon"
                        sx={{
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setSocialDialog(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

export default SocialPage;