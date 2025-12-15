import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Schedule as ScheduleIcon,
  Topic as TopicIcon,
  TrendingUp,
  CalendarMonth,
  Folder,
  Article
} from '@mui/icons-material';
import { useUser } from '../../hooks/useUser';
import apiService from '../../services/api';

const DashboardHome = ({ user, onLogout }) => {
  const { user: currentUser, userPlan, loading: userLoading, updateUser, loadUserData } = useUser();
  const [profileDialog, setProfileDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [topicDialog, setTopicDialog] = useState(false);
  const [socialDialog, setSocialDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    occupation: currentUser?.occupation || '',
    experience: currentUser?.experience || '',
    bio: currentUser?.bio || ''
  });

  const [scheduleData, setScheduleData] = useState({
    time1: currentUser?.schedules?.[0]?.time1 || '09:00',
    time2: currentUser?.schedules?.[0]?.time2 || '15:00',
    platforms: currentUser?.schedules?.[0]?.platforms?.map(p => p.platform) || []
  });

  const [selectedTopics, setSelectedTopics] = useState(currentUser?.topics?.map(t => t.topic) || []);
  const [customTopic, setCustomTopic] = useState('');

  const predefinedTopics = [
    'clean code practices',
    'debugging techniques',
    'code review tips',
    'performance optimization',
    'software architecture',
    'testing strategies',
    'developer productivity',
    'refactoring patterns',
    'API design',
    'database optimization',
    'git workflows',
    'CI/CD best practices',
    'microservices vs monoliths',
    'technical debt management',
    'security best practices'
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileSave = async () => {
    try {
      await updateUser({
        name: profileData.name,
        occupation: profileData.occupation,
        experience: profileData.experience,
        bio: profileData.bio
      });

      setProfileDialog(false);
      showSnackbar('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showSnackbar('Failed to update profile', 'error');
    }
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

      setScheduleDialog(false);
      showSnackbar('Schedule updated successfully');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      showSnackbar('Failed to update schedule', 'error');
    }
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim() && !selectedTopics.includes(customTopic.trim())) {
      setSelectedTopics(prev => [...prev, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const handleTopicsSave = async () => {
    try {
      await apiService.updateTopics({ topics: selectedTopics });

      setTopicDialog(false);
      showSnackbar('Topics updated successfully');
    } catch (error) {
      console.error('Failed to save topics:', error);
      showSnackbar('Failed to update topics', 'error');
    }
  };

  // Start real OAuth flow; mirrors SocialPage behaviour so both entry points are consistent.
  const handleSocialConnect = async (platform) => {
    try {
      if (platform === 'linkedin' || platform === 'twitter') {
        const authResponse = await apiService.initiateSocialAuth(platform);
        setSocialDialog(false);
        window.location.href = authResponse.authUrl;
      } else {
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
      await loadUserData();
      showSnackbar(`${platform} disconnected`, 'success');
    } catch (error) {
      console.error('Failed to disconnect social account:', error);
      showSnackbar(`Failed to disconnect ${platform}`, 'error');
    }
  };

  if (userLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress size={50} />
        </div>
      </Container>
    );
  }

  const stats = [
    {
      title: 'Connected',
      value: Object.keys(currentUser?.socialConnections || {}).length,
      subtitle: 'Accounts',
      icon: <LinkedInIcon />,
      iconColor: '#1e3a8a',
      iconBg: 'rgba(30, 58, 138, 0.08)'
    },
    {
      title: 'Active',
      value: currentUser?.schedules?.length || 0,
      subtitle: 'Schedules',
      icon: <CalendarMonth />,
      iconColor: '#b45309',
      iconBg: 'rgba(180, 83, 9, 0.08)'
    },
    {
      title: 'Selected',
      value: currentUser?.topics?.length || 0,
      subtitle: 'Topics',
      icon: <Folder />,
      iconColor: '#0f766e',
      iconBg: 'rgba(15, 118, 110, 0.08)'
    },
    {
      title: 'Generated',
      value: 0,
      subtitle: 'Posts',
      icon: <Article />,
      iconColor: '#334155',
      iconBg: 'rgba(51, 65, 85, 0.08)'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h4" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#718096' }}>
          Welcome back, {currentUser?.name}! Here's your overview.
        </Typography>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1">
          {/* Plan Card */}
          {userPlan && (
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                background: 'linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #0f172a 100%)',
                color: 'white'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <div className="flex items-center justify-between mb:4 md:mb-3">
                  <div>
                    <Typography variant="overline" sx={{ opacity: 0.85, fontSize: '0.75rem', letterSpacing: 1 }}>
                      CURRENT PLAN
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {userPlan.plan?.name || 'Free Trial'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp sx={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} />
                  </div>
                </div>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', my: 3 }} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Posts per Week
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {userPlan.postsPerWeek}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Used This Week
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {userPlan.postsThisWeek}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      Remaining
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {userPlan.remainingPosts}
                    </Typography>
                  </div>
                  {userPlan.subscribedAt && (
                    <div>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                        Member Since
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {new Date(userPlan.subscribedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stat.iconBg,
                      color: stat.iconColor,
                      mb: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {stat.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <div className="text-center py-8">
                <Typography variant="body1" sx={{ color: '#718096' }}>
                  No recent activity yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#a0aec0', mt: 1 }}>
                  Connect your accounts and set up a schedule to get started
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="w-full lg:w-96">
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: 24
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 3 }}>
                Quick Actions
              </Typography>
              
              <div className="flex flex-col gap-3">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LinkedInIcon />}
                  onClick={() => setSocialDialog(true)}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.4,
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 6px 18px rgba(59, 130, 246, 0.28)',
                    '&:hover': {
                      boxShadow: '0 10px 24px rgba(59, 130, 246, 0.35)'
                    }
                  }}
                >
                  Connect Accounts
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setScheduleDialog(true)}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.35,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    '&:hover': {
                      borderColor: '#94a3b8',
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  Set Schedule
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<TopicIcon />}
                  onClick={() => setTopicDialog(true)}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.35,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    '&:hover': {
                      borderColor: '#94a3b8',
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  Choose Topics
                </Button>
              </div>

              <Divider sx={{ my: 3 }} />

              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
                  Getting Started
                </Typography>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#2d3748' }}>
                        Connect your social accounts
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Link LinkedIn, Twitter, or Facebook
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    <div>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#2d3748' }}>
                        Choose your topics
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Select interests for content
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    <div>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#2d3748' }}>
                        Set posting schedule
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Automate your content
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
            Set Posting Schedule
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
            Configure automated posting times and select which platforms to use for content distribution.
          </Typography>

          {/* Time Selection Section */}
          <Box sx={{ mb: { xs: 4, sm: 5 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                mb: 3,
                fontSize: '1rem',
                letterSpacing: '-0.025em'
              }}
            >
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
                letterSpacing: '-0.025em'
              }}
            >
              Target Platforms
            </Typography>
            <div className="space-y-3">
              {[
                { platform: 'linkedin', label: 'LinkedIn', description: 'Professional networking', available: true, color: '#0077b5' },
                { platform: 'twitter', label: 'Twitter', description: 'Real-time engagement', available: true, color: '#1da1f2' },
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
                              color: color,
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

      {/* Topics Dialog */}
      <Dialog
        open={topicDialog}
        onClose={() => setTopicDialog(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: 3, sm: 4 },
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            maxHeight: { xs: '95vh', sm: '90vh' },
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
            Choose Content Topics
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
            Select topics that interest you to generate personalized, relevant content for your social media posts.
          </Typography>

          {/* Predefined Topics Section */}
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
              Popular Topics
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {predefinedTopics.map(topic => (
                <Card
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  sx={{
                    borderRadius: 2,
                    border: selectedTopics.includes(topic)
                      ? '2px solid #6366f1'
                      : '1px solid rgba(0, 0, 0, 0.06)',
                    background: selectedTopics.includes(topic)
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)'
                      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: selectedTopics.includes(topic)
                      ? '0 4px 12px rgba(99, 102, 241, 0.15)'
                      : '0 2px 4px rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: selectedTopics.includes(topic)
                        ? '0 8px 20px rgba(99, 102, 241, 0.2)'
                        : '0 8px 20px rgba(0, 0, 0, 0.1)',
                      borderColor: selectedTopics.includes(topic) ? '#6366f1' : 'rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: selectedTopics.includes(topic) ? 600 : 500,
                        color: selectedTopics.includes(topic) ? '#6366f1' : '#374151',
                        fontSize: '0.85rem',
                        lineHeight: 1.3
                      }}
                    >
                      {topic}
                    </Typography>
                    {selectedTopics.includes(topic) && (
                      <Box sx={{
                        mt: 1,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        mx: 'auto'
                      }} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>

          {/* Custom Topic Section */}
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
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: 2
              }} />
              Custom Topics
            </Typography>
            <div className="flex flex-col sm:flex-row gap-3">
              <TextField
                fullWidth
                label="Add your own topic"
                placeholder="e.g., React development, AI ethics, startup growth..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
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
              <Button
                onClick={handleAddCustomTopic}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  fontWeight: 600,
                  px: { xs: 4, sm: 3 },
                  py: 1.5,
                  borderRadius: 2,
                  minWidth: { xs: '100%', sm: '120px' },
                  textTransform: 'none',
                  letterSpacing: '0.025em',
                  boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px 0 rgba(5, 150, 105, 0.35)'
                  }
                }}
              >
                Add Topic
              </Button>
            </div>
          </Box>

          {/* Selected Topics Section */}
          {selectedTopics.length > 0 && (
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
                Selected Topics ({selectedTopics.length})
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map(topic => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleTopicToggle(topic)}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      color: 'white',
                      fontWeight: 500,
                      borderRadius: 2,
                      fontSize: '0.85rem',
                      px: 1.5,
                      py: 0.5,
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)',
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          color: 'white'
                        }
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                      }
                    }}
                  />
                ))}
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 3, sm: 4 },
          pt: 0,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            onClick={() => setTopicDialog(false)}
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
            onClick={handleTopicsSave}
            variant="contained"
            disabled={selectedTopics.length === 0}
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
              },
              '&:disabled': {
                background: '#9ca3af',
                boxShadow: 'none',
                transform: 'none'
              }
            }}
          >
            Save Topics ({selectedTopics.length})
          </Button>
        </DialogActions>
      </Dialog>

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

          <div className="space-y-4">
            {[
              { platform: 'linkedin', icon: <LinkedInIcon />, name: 'LinkedIn', gradient: 'from-blue-600 to-blue-700', bgColor: '#0077b5', available: true },
              { platform: 'twitter', icon: <TwitterIcon />, name: 'Twitter', gradient: 'from-sky-500 to-sky-600', bgColor: '#1da1f2', available: true },
              { platform: 'facebook', icon: <FacebookIcon />, name: 'Facebook', gradient: 'from-blue-600 to-blue-700', bgColor: '#1877f2', available: false }
            ].map(({ platform, icon, name, gradient, bgColor, available }) => (
              <Card
                key={platform}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': available ? {
                    transform: 'translateY(-2px) scale(1.01)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                  } : {}
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  {/* Professional responsive layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                            fontSize: { xs: '1.125rem', sm: '1.25rem' },
                            mb: 0.5,
                            letterSpacing: '-0.025em'
                          }}
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            fontWeight: 400
                          }}
                        >
                          {platform === 'linkedin' && 'Professional networking'}
                          {platform === 'twitter' && 'Real-time engagement'}
                          {platform === 'facebook' && 'Community building'}
                        </Typography>
                      </Box>
                    </div>
                    {currentUser?.socialConnections?.[platform]?.connected ? (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 3, sm: 2 },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        width: { xs: '100%', sm: 'auto' }
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
                            boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
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
                          width: { xs: '100%', sm: 'auto' },
                          minWidth: { xs: '100%', sm: '140px' },
                          borderRadius: 2,
                          textTransform: 'none',
                          letterSpacing: '0.025em',
                          boxShadow: `0 4px 14px 0 rgba(${bgColor === '#0077b5' ? '0, 119, 181' : bgColor === '#1da1f2' ? '29, 161, 242' : '24, 119, 242'}, 0.25)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${bgColor}dd 0%, ${bgColor} 100%)`,
                            transform: 'translateY(-1px)',
                            boxShadow: `0 6px 20px 0 rgba(${bgColor === '#0077b5' ? '0, 119, 181' : bgColor === '#1da1f2' ? '29, 161, 242' : '24, 119, 242'}, 0.35)`
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
                          boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)'
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 3, sm: 4 },
          pt: 0,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            onClick={() => setSocialDialog(false)}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardHome;