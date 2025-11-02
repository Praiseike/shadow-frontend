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
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Topic as TopicIcon,
  Add as AddIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const TopicsPage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [topicDialog, setTopicDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));

        // Update selected topics with fetched data
        if (profileData.user.topics?.length > 0) {
          setSelectedTopics(profileData.user.topics.map(t => t.topic));
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
      await apiService.updateTopics(selectedTopics);

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
        Topics
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
            Content Topics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
            Choose topics for your AI-generated posts
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>Selected Topics</Typography>
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
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTopicDialog(true)}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #3d9efc 0%, #00e5f0 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Manage Topics
          </Button>
        </CardContent>
      </Card>

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

export default TopicsPage;
