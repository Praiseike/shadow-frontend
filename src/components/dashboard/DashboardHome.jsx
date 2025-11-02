import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  IconButton,
  Drawer,
  ListItemButton,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Schedule as ScheduleIcon,
  Topic as TopicIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const DashboardHome = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('currentUser');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileSave = async () => {
    try {
      const response = await apiService.updateProfile({
        name: profileData.name,
        occupation: profileData.occupation,
        experience: profileData.experience,
        bio: profileData.bio
      });

      setCurrentUser(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
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

      // Refresh user profile to get updated topics
      const profileData = await apiService.getProfile();
      setCurrentUser(profileData.user);
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      setTopicDialog(false);
      showSnackbar('Topics updated successfully');
    } catch (error) {
      console.error('Failed to save topics:', error);
      showSnackbar('Failed to update topics', 'error');
    }
  };

  const handleSocialConnect = async (platform) => {
    try {
      // In a real implementation, this would redirect to OAuth
      // For now, we'll simulate the connection
      const mockConnectionData = {
        platform,
        accessToken: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
      };

      await apiService.connectSocial(platform, mockConnectionData);

      // Refresh user profile to get updated connections
      const profileData = await apiService.getProfile();
      setCurrentUser(profileData.user);
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      showSnackbar(`${platform} connected successfully`);
    } catch (error) {
      console.error('Failed to connect social account:', error);
      showSnackbar(`Failed to connect ${platform}`, 'error');
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
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>
                Welcome back, {currentUser?.name}!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '1rem' }}>
                Here's an overview of your PostNexus account
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {Object.keys(currentUser?.socialConnections || {}).length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Connected Accounts</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {currentUser?.schedules?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Schedules</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {currentUser?.topics?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Topics</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Paper sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      0
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Posts Generated</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                No recent activity yet. Connect your social accounts and set up a schedule to get started!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<LinkedInIcon />}
                  onClick={() => setSocialDialog(true)}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  Connect Social Account
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setScheduleDialog(true)}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e07dd1 0%, #e74c5f 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  Set Schedule
                </Button>
                <Button
                  variant="contained"
                  startIcon={<TopicIcon />}
                  onClick={() => setTopicDialog(true)}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3d9efc 0%, #00e5f0 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  Choose Topics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Dialog */}
      <Dialog
        open={profileDialog}
        onClose={() => setProfileDialog(false)}
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
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Occupation"
            value={profileData.occupation}
            onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Years of Experience"
            value={profileData.experience}
            onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setProfileDialog(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProfileSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialog}
        onClose={() => setScheduleDialog(false)}
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          fontWeight: 700,
          borderRadius: '12px 12px 0 0'
        }}>
          Set Posting Schedule
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '1rem' }}>
            Choose two times per day for automated posting
          </Typography>
          <TextField
            fullWidth
            label="First Post Time"
            type="time"
            value={scheduleData.time1}
            onChange={(e) => setScheduleData(prev => ({ ...prev, time1: e.target.value }))}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Second Post Time"
            type="time"
            value={scheduleData.time2}
            onChange={(e) => setScheduleData(prev => ({ ...prev, time2: e.target.value }))}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>Platforms</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleData.platforms.includes('linkedin')}
                  onChange={(e) => setScheduleData(prev => ({
                    ...prev,
                    platforms: e.target.checked
                      ? [...prev.platforms, 'linkedin']
                      : prev.platforms.filter(p => p !== 'linkedin')
                  }))}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#0077b5',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#0077b5'
                      }
                    }
                  }}
                />
              }
              label="LinkedIn"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleData.platforms.includes('twitter')}
                  onChange={(e) => setScheduleData(prev => ({
                    ...prev,
                    platforms: e.target.checked
                      ? [...prev.platforms, 'twitter']
                      : prev.platforms.filter(p => p !== 'twitter')
                  }))}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1da1f2',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#1da1f2'
                      }
                    }
                  }}
                />
              }
              label="Twitter"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleData.platforms.includes('facebook')}
                  onChange={(e) => setScheduleData(prev => ({
                    ...prev,
                    platforms: e.target.checked
                      ? [...prev.platforms, 'facebook']
                      : prev.platforms.filter(p => p !== 'facebook')
                  }))}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1877f2',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#1877f2'
                      }
                    }
                  }}
                />
              }
              label="Facebook"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setScheduleDialog(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #e07dd1 0%, #e74c5f 100%)',
                transform: 'translateY(-2px)'
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
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          fontWeight: 700,
          borderRadius: '12px 12px 0 0'
        }}>
          Choose Content Topics
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '1rem' }}>
            Select topics for your AI-generated posts
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>Predefined Topics</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
            {predefinedTopics.map(topic => (
              <Chip
                key={topic}
                label={topic}
                clickable
                onClick={() => handleTopicToggle(topic)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  transition: 'all 0.2s ease-in-out',
                  background: selectedTopics.includes(topic)
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.8)',
                  color: selectedTopics.includes(topic) ? 'white' : '#2d3748',
                  border: selectedTopics.includes(topic) ? 'none' : '1px solid #e2e8f0',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>Custom Topics</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Add custom topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)'
                  }
                }
              }}
            />
            <Button
              onClick={handleAddCustomTopic}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2dd4bf 0%, #34d399 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Add
            </Button>
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>Selected Topics</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {selectedTopics.map(topic => (
              <Chip
                key={topic}
                label={topic}
                onDelete={() => handleTopicToggle(topic)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 2,
                  '& .MuiChip-deleteIcon': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      color: 'white'
                    }
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setTopicDialog(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleTopicsSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #3d9efc 0%, #00e5f0 100%)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Save Topics
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
              { platform: 'linkedin', icon: <LinkedInIcon />, name: 'LinkedIn', color: '#0077b5', gradient: 'linear-gradient(135deg, #0077b5 0%, #005885 100%)' },
              { platform: 'twitter', icon: <TwitterIcon />, name: 'Twitter', color: '#1da1f2', gradient: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)' },
              { platform: 'facebook', icon: <FacebookIcon />, name: 'Facebook', color: '#1877f2', gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5bd7 100%)' }
            ].map(({ platform, icon, name, color, gradient }) => (
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
                    {currentUser?.socialConnections?.[platform]?.connected ? (
                      <Chip
                        label="Connected"
                        color="success"
                        sx={{
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white'
                        }}
                      />
                    ) : (
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

export default DashboardHome;