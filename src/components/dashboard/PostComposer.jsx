import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Article as ArticleIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import apiService from '../../services/api';
import { useUser } from '../../hooks/useUser';

const PostComposer = ({ onSuccess, initialContent }) => {
  const { user: currentUser, userPlan } = useUser();
  const [content, setContent] = useState(initialContent || '');
  const [platforms, setPlatforms] = useState([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [postNow, setPostNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [socialConnections, setSocialConnections] = useState({});

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connections = await apiService.getSocialConnections();
        const connectionsMap = {};
        connections.connections?.forEach(conn => {
          connectionsMap[conn.platform] = true;
        });
        setSocialConnections(connectionsMap);
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      }
    };

    fetchConnections();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePlatformToggle = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter(p => p !== platform));
    } else {
      if (socialConnections[platform]) {
        setPlatforms([...platforms, platform]);
      } else {
        showSnackbar(`Please connect ${platform} account first`, 'warning');
      }
    }
  };

  const handleScheduleToggle = (e) => {
    setPostNow(!e.target.checked);
    if (e.target.checked && !scheduledAt) {
      // Set default scheduled time to 1 hour from now (format: YYYY-MM-DDTHH:mm)
      const oneHourLater = new Date();
      oneHourLater.setHours(oneHourLater.getHours() + 1);
      // Format to datetime-local format (YYYY-MM-DDTHH:mm)
      const year = oneHourLater.getFullYear();
      const month = String(oneHourLater.getMonth() + 1).padStart(2, '0');
      const day = String(oneHourLater.getDate()).padStart(2, '0');
      const hours = String(oneHourLater.getHours()).padStart(2, '0');
      const minutes = String(oneHourLater.getMinutes()).padStart(2, '0');
      setScheduledAt(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  };

  const handlePost = async () => {
    // Validate
    if (!content.trim()) {
      showSnackbar('Please enter post content', 'error');
      return;
    }

    if (platforms.length === 0) {
      showSnackbar('Please select at least one platform', 'error');
      return;
    }

    if (!postNow && !scheduledAt) {
      showSnackbar('Please select a scheduled date and time', 'error');
      return;
    }

    if (!postNow && scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate <= new Date()) {
        showSnackbar('Scheduled time must be in the future', 'error');
        return;
      }
    }

    setLoading(true);

    try {
      if (postNow) {
        // Post immediately to each platform
        // This would use the existing social posting endpoints
        showSnackbar('Immediate posting not yet implemented. Please use schedule option.', 'info');
        setLoading(false);
        return;
      } else {
        // Create scheduled post
        const scheduledDate = new Date(scheduledAt);
        await apiService.createScheduledPost({
          content: content.trim(),
          scheduledAt: scheduledDate.toISOString(),
          platforms,
          type: 'manual'
        });

        showSnackbar('Post scheduled successfully!', 'success');
        
        // Reset form
        setContent('');
        setPlatforms([]);
        setScheduledAt(null);
        setPostNow(true);

        // Notify parent component
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Failed to schedule post:', error);
      const errorMsg = error.message || 'Failed to schedule post. Please try again.';
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const availablePlatforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077b5' },
    { id: 'twitter', name: 'Twitter', icon: <TwitterIcon />, color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon />, color: '#1877F2' }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748', mb: 3 }}>
            Create Post
          </Typography>

          {/* Content Editor */}
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What would you like to share?"
            sx={{ mb: 3 }}
            helperText={`${content.length} characters`}
          />

          {/* Platform Selection */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
            Select Platforms
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {availablePlatforms.map((platform) => {
              const isConnected = socialConnections[platform.id];
              const isSelected = platforms.includes(platform.id);
              
              return (
                <Chip
                  key={platform.id}
                  icon={platform.icon}
                  label={platform.name}
                  onClick={() => handlePlatformToggle(platform.id)}
                  sx={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${platform.color} 0%, ${platform.color}dd 100%)`
                      : '#f7fafc',
                    color: isSelected ? 'white' : '#2d3748',
                    border: isConnected ? 'none' : '1px dashed #cbd5e0',
                    opacity: isConnected ? 1 : 0.5,
                    cursor: isConnected ? 'pointer' : 'not-allowed',
                    '&:hover': isConnected ? {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${platform.color}40`
                    } : {},
                    transition: 'all 0.2s ease'
                  }}
                />
              );
            })}
          </Box>

          {platforms.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Select at least one platform to post. Make sure you've connected your accounts in the Social Accounts page.
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Scheduling Options */}
          <FormControlLabel
            control={
              <Switch
                checked={!postNow}
                onChange={handleScheduleToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Schedule for later
                </Typography>
              </Box>
            }
            sx={{ mb: 2 }}
          />


          {/* Plan Limit Info */}
          {userPlan && !postNow && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Your plan allows {userPlan.postsPerWeek} posts per week. 
              {userPlan.remainingPosts > 0 ? (
                <> You have {userPlan.remainingPosts} posts remaining this week.</>
              ) : (
                <> You've used all your posts for this week.</>
              )}
            </Alert>
          )}

          {!postNow && (
            <TextField
              fullWidth
              type="datetime-local"
              label="Schedule Date & Time"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              helperText="Select when you want this post to be published"
              inputProps={{
                min: new Date().toISOString().slice(0, 16) // Prevent past dates
              }}
            />
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setContent('');
                setPlatforms([]);
                setScheduledAt('');
                setPostNow(true);
              }}
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={postNow ? <SendIcon /> : <ScheduleIcon />}
              onClick={handlePost}
              disabled={loading || content.trim().length === 0 || platforms.length === 0}
              sx={{
                background: postNow
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                fontWeight: 600,
                px: 4,
                py: 1.5
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : postNow ? (
                'Post Now'
              ) : (
                'Schedule Post'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostComposer;

