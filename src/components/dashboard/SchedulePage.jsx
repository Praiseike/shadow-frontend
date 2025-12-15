import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Snackbar,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const SchedulePage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [scheduleData, setScheduleData] = useState({
    time1: currentUser?.schedules?.[0]?.time1 || '09:00',
    time2: currentUser?.schedules?.[0]?.time2 || '15:00',
    platforms: currentUser?.schedules?.[0]?.platforms?.map(p => p.platform) || []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));

        // Update schedule data with fetched data
        if (profileData.user.schedules?.length > 0) {
          const schedule = profileData.user.schedules[0];
          setScheduleData({
            time1: schedule.time1,
            time2: schedule.time2,
            platforms: schedule.platforms?.map(p => p.platform) || []
          });
        }
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

    fetchUserData();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleScheduleSave = async () => {
    try {
      const schedulePayload = {
        time1: scheduleData.time1,
        time2: scheduleData.time2,
        platforms: scheduleData.platforms,
        active: true
      };

      await apiService.createOrUpdateSchedule(schedulePayload);

      // Refresh user profile to get updated schedules
      const profileData = await apiService.getProfile();
      setCurrentUser(profileData.user);
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      setScheduleDialog(false);
      showSnackbar('Schedule updated successfully');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      showSnackbar('Failed to update schedule', 'error');
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

  console.log(currentUser.schedules);
  

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
          Posting Schedule
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
          Configure automated posting times to maintain consistent engagement across your social platforms
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
              Current Schedule
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
              Manage your automated posting schedule and target platforms
            </Typography>
          </Box>

          {currentUser.schedules?.length > 0 ? (
            <Box>
              {currentUser.schedules.map((schedule, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        mr: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ScheduleIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '1.125rem',
                          letterSpacing: '-0.025em'
                        }}
                      >
                        Active Schedule
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
                      <Box sx={{
                        p: 3,
                        background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600, mb: 1 }}>
                          First Post
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.25rem' }}>
                          {schedule.time1}
                        </Typography>
                      </Box>

                      <Box sx={{
                        p: 3,
                        background: 'linear-gradient(145deg, rgba(5, 150, 105, 0.1) 0%, rgba(4, 120, 87, 0.05) 100%)',
                        borderRadius: 2,
                        border: '1px solid rgba(5, 150, 105, 0.2)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600, mb: 1 }}>
                          Second Post
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.25rem' }}>
                          {schedule.time2}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                        Target Platforms
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {schedule.platforms?.length > 0 ? schedule.platforms.map(platform => (
                          <Chip
                            key={platform}
                            label={platform?.charAt(0).toUpperCase() + platform?.slice(1)}
                            sx={{
                              background: platform === 'linkedin'
                                ? 'linear-gradient(135deg, #0077b5 0%, #005885 100%)'
                                : platform === 'twitter'
                                ? 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              color: 'white',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              height: 28
                            }}
                          />
                        )) : (
                          <Typography variant="body2" sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                            No platforms selected
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setScheduleDialog(true)}
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        borderRadius: 2,
                        py: 1.5,
                        px: 4,
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                        textTransform: 'none',
                        letterSpacing: '0.025em',
                        boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.35)'
                        }
                      }}
                    >
                      Edit Schedule
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={{
              borderRadius: 3,
              border: '2px dashed rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              py: { xs: 6, sm: 8 },
              px: 4
            }}>
              <Box sx={{
                p: 2,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ScheduleIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#1e293b',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '1.25rem'
                }}
              >
                No Schedule Configured
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  mb: 4,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '400px',
                  mx: 'auto'
                }}
              >
                Set up automated posting times to maintain consistent engagement across your social platforms
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setScheduleDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  px: { xs: 4, sm: 5 },
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  letterSpacing: '0.025em',
                  boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.35)'
                  }
                }}
              >
                Create Schedule
              </Button>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialog}
        onClose={() => setScheduleDialog(false)}
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
            Configure Posting Schedule
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
            Set automated posting times and select which platforms to include in your schedule.
          </Typography>

          {/* Time Selection Section */}
          <Box sx={{ mb: { xs: 5, sm: 6 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                mb: 3,
                fontSize: '1rem',
                letterSpacing: '-0.025em',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{
                width: 4,
                height: 16,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: 2
              }} />
              Posting Times
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="First Post Time"
                type="time"
                value={scheduleData.time1}
                onChange={(e) => setScheduleData(prev => ({ ...prev, time1: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#64748b',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#6366f1',
                      fontWeight: 600,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Second Post Time"
                type="time"
                value={scheduleData.time2}
                onChange={(e) => setScheduleData(prev => ({ ...prev, time2: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#059669',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#64748b',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#059669',
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </div>
          </Box>

          {/* Platform Selection Section */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                mb: 3,
                fontSize: '1rem',
                letterSpacing: '-0.025em',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{
                width: 4,
                height: 16,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                borderRadius: 2
              }} />
              Target Platforms
            </Typography>
            <div className="space-y-3">
              {[
                { platform: 'linkedin', label: 'LinkedIn', description: 'Professional networking', available: true, color: '#0077b5' },
                { platform: 'twitter', label: 'Twitter', description: 'Real-time engagement', available: false, color: '#1da1f2' },
                { platform: 'facebook', label: 'Facebook', description: 'Coming Soon', available: false, color: '#f59e0b' }
              ].map(({ platform, label, description, available, color }) => (
                <Card
                  key={platform}
                  sx={{
                    borderRadius: 2,
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
                  <CardContent sx={{ p: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scheduleData.platforms.includes(platform)}
                          onChange={(e) => setScheduleData(prev => ({
                            ...prev,
                            platforms: e.target.checked
                              ? [...prev.platforms, platform]
                              : prev.platforms.filter(p => p !== platform)
                          }))}
                          disabled={!available}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              color: available ? color : '#d1d5db',
                              '&.Mui-checked': {
                                color: color,
                                '& + .MuiSwitch-track': {
                                  backgroundColor: `${color}40`,
                                },
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-disabled': {
                              color: '#d1d5db',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#f3f4f6'
                              }
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: available ? '#1e293b' : '#92400e',
                              fontSize: '0.95rem',
                              lineHeight: 1.2
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: available ? '#64748b' : '#d97706',
                              fontSize: '0.8rem',
                              fontWeight: 400
                            }}
                          >
                            {description}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        m: 0,
                        width: '100%',
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          flex: 1,
                          marginTop: '2px'
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 3, sm: 4 },
          pt: 0,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            onClick={() => setScheduleDialog(false)}
            sx={{
              fontWeight: 500,
              width: { xs: '100%', sm: 'auto' },
              order: { xs: 1, sm: 0 },
              px: 4,
              py: 1.5,
              borderRadius: 2,
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#f8fafc'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontWeight: 600,
              px: { xs: 4, sm: 3 },
              py: 1.5,
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '100%', sm: '140px' },
              textTransform: 'none',
              letterSpacing: '0.025em',
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.35)'
              }
            }}
          >
            Save Schedule
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

export default SchedulePage;