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
      <Container maxWidth="lg" sx={{
        py: { xs: 8, sm: 12 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#6366f1' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{
      py: { xs: 3, sm: 4 },
      minHeight: '100vh',
      background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)'
    }}>
      {/* Header Section */}
      <Box sx={{
        mb: { xs: 4, sm: 5 },
        textAlign: { xs: 'center', md: 'left' }
      }}>
        <Typography
          variant="h4"
          sx={{
            color: '#1e293b',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem' },
            letterSpacing: '-0.025em',
            mb: 2
          }}
        >
          Social Accounts
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            fontSize: '1.1rem',
            fontWeight: 400,
            maxWidth: '600px',
            mx: { xs: 'auto', md: 0 }
          }}
        >
          Connect and manage your social media accounts for automated content distribution
        </Typography>
      </Box>

      <Card sx={{
        borderRadius: { xs: 3, sm: 4 },
        border: '1px solid rgba(0, 0, 0, 0.06)',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ mb: { xs: 4, sm: 5 } }}>
            <Typography
              variant="h6"
              sx={{
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '1.25rem',
                letterSpacing: '-0.025em',
                mb: 2
              }}
            >
              Connected Social Accounts
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Link your social media accounts to enable automated content distribution across platforms
            </Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, sm: 4 },
            maxWidth: '100%'
          }}>
            {[
              {
                platform: 'linkedin',
                icon: <LinkedInIcon />,
                name: 'LinkedIn',
                bgColor: '#0077b5',
                description: 'Professional networking',
                available: true
              },
              {
                platform: 'twitter',
                icon: <TwitterIcon />,
                name: 'Twitter',
                bgColor: '#1da1f2',
                description: 'Real-time engagement',
                available: true
              },
              {
                platform: 'facebook',
                icon: <FacebookIcon />,
                name: 'Facebook',
                bgColor: '#f59e0b',
                description: 'Coming Soon',
                available: false
              }
            ].map(({ platform, icon, name, bgColor, description, available }) => (
              <Card
                key={platform}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  background: available
                    ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)'
                    : 'linear-gradient(145deg, rgba(254, 243, 199, 0.3) 0%, rgba(253, 230, 138, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: available
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    : '0 2px 4px rgba(245, 158, 11, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': available ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                  } : {}
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  {/* Mobile-first responsive layout */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}
                           style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)` }}>
                        {icon}
                      </div>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '1.125rem',
                            letterSpacing: '-0.025em',
                            mb: 0.5
                          }}
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: available ? '#64748b' : '#d97706',
                            fontSize: '0.875rem',
                            fontWeight: 400
                          }}
                        >
                          {description}
                        </Typography>
                      </Box>
                    </div>

                    {currentUser.socialConnections?.[platform]?.connected ? (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 3, sm: 2 },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        width: '100%'
                      }}>
                        <Chip
                          label="✓ Connected"
                          sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            height: { xs: 32, sm: 36 },
                            px: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
                            flex: { xs: 1, sm: 'none' }
                          }}
                        />
                        <Button
                          variant="outlined"
                          onClick={() => handleSocialDisconnect(platform)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            px: { xs: 3, sm: 2.5 },
                            py: { xs: 1.25, sm: 1 },
                            width: { xs: '100%', sm: 'auto' },
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#9ca3af',
                              backgroundColor: '#f9fafb'
                            }
                          }}
                        >
                          Disconnect
                        </Button>
                      </Box>
                    ) : available ? (
                      <Button
                        variant="contained"
                        onClick={() => handleSocialConnect(platform)}
                        sx={{
                          background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
                          fontWeight: 600,
                          px: { xs: 4, sm: 3.5 },
                          py: { xs: 1.5, sm: 1.25 },
                          fontSize: { xs: '0.9rem', sm: '0.95rem' },
                          width: '100%',
                          borderRadius: 2,
                          textTransform: 'none',
                          letterSpacing: '0.025em',
                          boxShadow: `0 4px 14px 0 rgba(${bgColor === '#0077b5' ? '0, 119, 181' : '29, 161, 242'}, 0.25)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${bgColor}dd 0%, ${bgColor} 100%)`,
                            transform: 'translateY(-1px)',
                            boxShadow: `0 6px 20px 0 rgba(${bgColor === '#0077b5' ? '0, 119, 181' : '29, 161, 242'}, 0.35)`
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
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          height: { xs: 32, sm: 36 },
                          px: 2,
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
                          width: 'fit-content'
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Box>
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
            borderRadius: { xs: 3, sm: 4 },
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(20px)',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          fontWeight: 600,
          py: { xs: 3, sm: 3.5 },
          px: { xs: 3, sm: 4 },
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          letterSpacing: '-0.025em',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            borderRadius: 'inherit'
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            Connect Social Accounts
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 3, sm: 4 }, pb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              mb: { xs: 4, sm: 5 },
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Link your social media accounts to enable automated content distribution and analytics tracking.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              {
                platform: 'linkedin',
                icon: <LinkedInIcon />,
                name: 'LinkedIn',
                bgColor: '#0077b5',
                description: 'Professional networking',
                available: true
              },
              {
                platform: 'twitter',
                icon: <TwitterIcon />,
                name: 'Twitter',
                bgColor: '#1da1f2',
                description: 'Real-time engagement',
                available: true
              },
              {
                platform: 'facebook',
                icon: <FacebookIcon />,
                name: 'Facebook',
                bgColor: '#f59e0b',
                description: 'Coming Soon',
                available: false
              }
            ].map(({ platform, icon, name, bgColor, description, available }) => (
              <Card
                key={platform}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  background: available
                    ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)'
                    : 'linear-gradient(145deg, rgba(254, 243, 199, 0.3) 0%, rgba(253, 230, 138, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: available
                    ? '0 2px 4px rgba(0, 0, 0, 0.04)'
                    : '0 2px 4px rgba(245, 158, 11, 0.1)',
                  transition: 'all 0.2s ease',
                  opacity: available ? 1 : 0.7
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}
                           style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)` }}>
                        {icon}
                      </div>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '1.125rem',
                            letterSpacing: '-0.025em',
                            mb: 0.5
                          }}
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: available ? '#64748b' : '#d97706',
                            fontSize: '0.875rem',
                            fontWeight: 400
                          }}
                        >
                          {description}
                        </Typography>
                      </Box>
                    </Box>
                    {currentUser.socialConnections?.[platform]?.connected ? (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip
                          label="✓ Connected"
                          sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            color: 'white',
                            fontSize: '0.875rem',
                            height: 36,
                            px: 2,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleSocialDisconnect(platform)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 2.5,
                            py: 1,
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#9ca3af',
                              backgroundColor: '#f9fafb'
                            }
                          }}
                        >
                          Disconnect
                        </Button>
                      </Box>
                    ) : available ? (
                      <Button
                        variant="contained"
                        onClick={() => handleSocialConnect(platform)}
                        sx={{
                          background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
                          fontWeight: 600,
                          px: 3.5,
                          py: 1.25,
                          fontSize: '0.95rem',
                          borderRadius: 2,
                          textTransform: 'none',
                          letterSpacing: '0.025em',
                          boxShadow: `0 4px 14px 0 rgba(${bgColor === '#0077b5' ? '0, 119, 181' : '29, 161, 242'}, 0.25)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${bgColor}dd 0%, ${bgColor} 100%)`,
                            transform: 'translateY(-1px)',
                            boxShadow: `0 6px 20px 0 rgba(${bgColor === '#0077b5' ? '0, 119, 181' : '29, 161, 242'}, 0.35)`
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
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          fontSize: '0.875rem',
                          height: 36,
                          px: 2,
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)'
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 3, sm: 4 },
          pt: 0,
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            onClick={() => setSocialDialog(false)}
            sx={{
              fontWeight: 500,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#f8fafc'
              }
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