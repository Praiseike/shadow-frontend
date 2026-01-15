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
  Article,
  CheckCircle,
  Error as ErrorIcon,
  Pending,
  BarChart
} from '@mui/icons-material';
import { useUser } from '../../hooks/useUser';
import apiService from '../../services/api';

const DashboardHome = ({ user, onLogout }) => {
  const { user: currentUser, userPlan, loading: userLoading, updateUser } = useUser();
  const [profileDialog, setProfileDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [topicDialog, setTopicDialog] = useState(false);
  const [socialDialog, setSocialDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

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

  // Fetch dashboard overview data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingDashboard(true);
        const data = await apiService.getDashboardOverview();
        setDashboardData(data.overview);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        showSnackbar('Failed to load dashboard data', 'error');
      } finally {
        setLoadingDashboard(false);
      }
    };

    if (!userLoading) {
      fetchDashboardData();
    }
  }, [userLoading]);

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

  if (userLoading || loadingDashboard) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress size={50} />
        </div>
      </Container>
    );
  }

  const stats = dashboardData ? [
    {
      title: 'Connected',
      value: dashboardData.stats.connectedAccounts,
      subtitle: 'Accounts',
      icon: <LinkedInIcon />,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Active',
      value: dashboardData.stats.activeSchedules,
      subtitle: 'Schedules',
      icon: <CalendarMonth />,
      gradient: 'from-pink-500 to-red-500'
    },
    {
      title: 'Selected',
      value: dashboardData.stats.selectedTopics,
      subtitle: 'Topics',
      icon: <Folder />,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Generated',
      value: dashboardData.stats.totalGenerated,
      subtitle: 'Posts',
      icon: <Article />,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Posted',
      value: dashboardData.stats.totalPosted,
      subtitle: 'Posts',
      icon: <CheckCircle />,
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'This Week',
      value: dashboardData.stats.postsThisWeek,
      subtitle: 'Posts',
      icon: <BarChart />,
      gradient: 'from-orange-500 to-red-500'
    }
  ] : [
    {
      title: 'Connected',
      value: Object.keys(currentUser?.socialConnections || {}).length,
      subtitle: 'Accounts',
      icon: <LinkedInIcon />,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Active',
      value: currentUser?.schedules?.length || 0,
      subtitle: 'Schedules',
      icon: <CalendarMonth />,
      gradient: 'from-pink-500 to-red-500'
    },
    {
      title: 'Selected',
      value: currentUser?.topics?.length || 0,
      subtitle: 'Topics',
      icon: <Folder />,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Generated',
      value: 0,
      subtitle: 'Posts',
      icon: <Article />,
      gradient: 'from-green-500 to-teal-500'
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
          {(userPlan || dashboardData?.plan) && (
            <Card sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 10px 30px -5px rgba(102, 126, 234, 0.3)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent sx={{ p: 4 }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="overline" sx={{ opacity: 0.9, fontSize: '0.75rem', letterSpacing: 1 }}>
                      CURRENT PLAN
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {dashboardData?.plan?.name || userPlan?.plan?.name || 'Free Trial'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </div>
                </div>
                
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Posts per Week
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {dashboardData?.plan?.postsPerWeek || userPlan?.postsPerWeek || 2}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Used This Week
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {dashboardData?.plan?.postsThisWeek || userPlan?.postsThisWeek || 0}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                      Remaining
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {dashboardData?.plan?.remainingPosts || userPlan?.remainingPosts || 0}
                    </Typography>
                  </div>
                  {(userPlan?.subscribedAt || dashboardData?.plan?.subscribedAt) && (
                    <div>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                        Member Since
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {new Date(userPlan?.subscribedAt || dashboardData?.plan?.subscribedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <div className={`bg-gradient-to-br ${stat.gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#718096' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                    {stat.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {dashboardData?.recentPosts && dashboardData.recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Chip
                            label={post.platform}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          />
                          <Chip
                            label={post.status}
                            size="small"
                            icon={
                              post.status === 'posted' ? <CheckCircle /> :
                              post.status === 'failed' ? <ErrorIcon /> :
                              <Pending />
                            }
                            color={
                              post.status === 'posted' ? 'success' :
                              post.status === 'failed' ? 'error' :
                              'default'
                            }
                          />
                        </div>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </div>
                      <Typography variant="body2" sx={{ color: '#2d3748' }}>
                        {post.content}
                      </Typography>
                      {post.error && (
                        <Typography variant="caption" sx={{ color: '#e53e3e', mt: 1, display: 'block' }}>
                          Error: {post.error}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Typography variant="body1" sx={{ color: '#718096' }}>
                    No recent activity yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a0aec0', mt: 1 }}>
                    Connect your accounts and set up a schedule to get started
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Post Performance */}
          {dashboardData?.postsByPlatform && dashboardData.postsByPlatform.length > 0 && (
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                  Post Performance by Platform
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.postsByPlatform.map((platform) => (
                    <div
                      key={platform.platform}
                      className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {platform.platform === 'linkedin' && <LinkedInIcon sx={{ color: '#0077b5' }} />}
                        {platform.platform === 'twitter' && <TwitterIcon sx={{ color: '#1DA1F2' }} />}
                        {platform.platform === 'facebook' && <FacebookIcon sx={{ color: '#1877F2' }} />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2d3748', textTransform: 'capitalize' }}>
                          {platform.platform}
                        </Typography>
                      </div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {platform.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Posts
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                  startIcon={<LinkedInIcon />}
                  onClick={() => setSocialDialog(true)}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    py: 1.8,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)'
                    }
                  }}
                >
                  Connect Accounts
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setScheduleDialog(true)}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: 2,
                    py: 1.8,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(240, 147, 251, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e07dd1 0%, #e74c5f 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(240, 147, 251, 0.5)'
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
                    py: 1.8,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(79, 172, 254, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3d9efc 0%, #00e5f0 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(79, 172, 254, 0.5)'
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
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          fontWeight: 700,
          py: 2.5
        }}>
          Set Posting Schedule
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
            Choose two times per day for automated posting
          </Typography>
          <TextField
            fullWidth
            label="First Post Time"
            type="time"
            value={scheduleData.time1}
            onChange={(e) => setScheduleData(prev => ({ ...prev, time1: e.target.value }))}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Second Post Time"
            type="time"
            value={scheduleData.time2}
            onChange={(e) => setScheduleData(prev => ({ ...prev, time2: e.target.value }))}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Select Platforms
          </Typography>
          <div className="flex flex-col gap-2">
            {['linkedin', 'twitter', 'facebook'].map((platform) => (
              <FormControlLabel
                key={platform}
                control={
                  <Switch
                    checked={scheduleData.platforms.includes(platform)}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      platforms: e.target.checked
                        ? [...prev.platforms, platform]
                        : prev.platforms.filter(p => p !== platform)
                    }))}
                  />
                }
                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setScheduleDialog(false)} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              fontWeight: 600,
              px: 3
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
        sx={{ '& .MuiDialog-paper': { borderRadius: 3, maxHeight: '90vh' } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          fontWeight: 700,
          py: 2.5
        }}>
          Choose Content Topics
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
            Select topics for your AI-generated posts
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Predefined Topics
          </Typography>
          <div className="flex flex-wrap gap-2 mb-4">
            {predefinedTopics.map(topic => (
              <Chip
                key={topic}
                label={topic}
                clickable
                onClick={() => handleTopicToggle(topic)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  background: selectedTopics.includes(topic)
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f7fafc',
                  color: selectedTopics.includes(topic) ? 'white' : '#2d3748',
                  border: selectedTopics.includes(topic) ? 'none' : '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
              />
            ))}
          </div>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Add Custom Topic
          </Typography>
          <div className="flex gap-2 mb-4">
            <TextField
              fullWidth
              label="Custom topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
            />
            <Button
              onClick={handleAddCustomTopic}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                fontWeight: 600,
                px: 3
              }}
            >
              Add
            </Button>
          </div>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Selected Topics ({selectedTopics.length})
          </Typography>
          <div className="flex flex-wrap gap-2">
            {selectedTopics.map(topic => (
              <Chip
                key={topic}
                label={topic}
                onDelete={() => handleTopicToggle(topic)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setTopicDialog(false)} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleTopicsSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              fontWeight: 600,
              px: 3
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
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          py: 2.5
        }}>
          Connect Social Accounts
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ color: '#718096', mb: 4 }}>
            Connect your social media accounts to enable automated posting
          </Typography>

          <div className="space-y-3">
            {[
              { platform: 'linkedin', icon: <LinkedInIcon />, name: 'LinkedIn', gradient: 'from-blue-600 to-blue-700' },
              { platform: 'twitter', icon: <TwitterIcon />, name: 'Twitter', gradient: 'from-sky-400 to-sky-600' },
              { platform: 'facebook', icon: <FacebookIcon />, name: 'Facebook', gradient: 'from-blue-500 to-blue-600' }
            ].map(({ platform, icon, name, gradient }) => (
              <Card
                key={platform}
                sx={{
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${gradient} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                        {icon}
                      </div>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                        {name}
                      </Typography>
                    </div>
                    {currentUser?.socialConnections?.[platform]?.connected ? (
                      <Chip
                        label="Connected"
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
                          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                          fontWeight: 600,
                          px: 3
                        }}
                        className={`bg-gradient-to-r ${gradient}`}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setSocialDialog(false)} sx={{ fontWeight: 600 }}>
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