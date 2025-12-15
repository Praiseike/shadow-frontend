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
          Content Topics
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
          Select topics that interest you to generate personalized, relevant content for your social media posts
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
              Your Selected Topics
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
              Manage your content interests to receive personalized AI-generated posts
            </Typography>
          </Box>

          {/* Selected Topics Display */}
          <Box sx={{ mb: { xs: 4, sm: 5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{
                width: 4,
                height: 16,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: 2
              }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '1rem',
                  letterSpacing: '-0.025em'
                }}
              >
                Selected Topics ({selectedTopics.length})
              </Typography>
            </Box>

            {selectedTopics.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {selectedTopics.map(topic => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleTopicToggle(topic)}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
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
              </Box>
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: { xs: 4, sm: 6 },
                px: 4,
                background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)',
                borderRadius: 3,
                border: '2px dashed rgba(0, 0, 0, 0.08)'
              }}>
                <Box sx={{
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TopicIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#374151',
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.125rem'
                  }}
                >
                  No Topics Selected
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    mb: 4
                  }}
                >
                  Choose topics to start receiving personalized AI-generated content
                </Typography>
              </Box>
            )}
          </Box>

          {/* Manage Topics Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTopicDialog(true)}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: { xs: '0.95rem', sm: '1rem' },
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
            Manage Content Topics
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
              Add Custom Topic
            </Typography>
            <div className="flex flex-col sm:flex-row gap-3">
              <TextField
                fullWidth
                label="Enter your own topic"
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
                  minWidth: { xs: '100%', sm: '140px' },
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
                      fontSize: '0.85rem',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
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
