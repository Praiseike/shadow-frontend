import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Topic as TopicIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';
import topicsData from '../data/topics.json';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [onboardingData, setOnboardingData] = useState({
    topics: [],
    bio: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const topicCategories = topicsData.categories;

  // Filter categories and topics based on search term
  const filteredCategories = topicCategories.map(category => ({
    ...category,
    topics: category.topics.filter(topic =>
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.topics.length > 0
  );

  const steps = [
    {
      title: 'Choose Your Topics',
      subtitle: 'Select topics for your AI-generated posts',
      icon: <TopicIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
    },
    {
      title: 'Tell Us About Yourself',
      subtitle: 'Write a short bio for your profile',
      icon: <PersonIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.8)' }} />
    }
  ];

  const handleTopicToggle = (topic) => {
    setOnboardingData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      // Update profile with bio
      await apiService.updateProfile({
        bio: onboardingData.bio
      });

      // Update topics
      await apiService.updateTopics(onboardingData.topics);

      // Refresh user data
      const profileData = await apiService.getProfile();
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));

      // Navigate to dashboard
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
              Select Topics
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Choose topics that interest you for personalized content
            </Typography>

            {/* Search Input */}
            <TextField
              fullWidth
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }}>
                    🔍
                  </Box>
                )
              }}
            />

            <Box className="scroll-none" sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <Box key={category.name} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      {category.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {category.topics.map(topic => (
                        <Chip
                          key={topic}
                          label={topic}
                          clickable
                          onClick={() => handleTopicToggle(topic)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            background: onboardingData.topics.includes(topic)
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'rgba(255, 255, 255, 0.1)',
                            color: onboardingData.topics.includes(topic) ? 'white' : 'rgba(255, 255, 255, 0.8)',
                            border: onboardingData.topics.includes(topic) ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    No topics found matching "{searchTerm}"
                  </Typography>
                </Box>
              )}
            </Box>
            {onboardingData.topics.length > 0 && (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 2 }}>
                Selected: {onboardingData.topics.length} topics
              </Typography>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
              Your Bio
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Tell us a bit about yourself and your expertise
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="I'm a software engineer with 5 years of experience in full-stack development..."
              value={onboardingData.bio}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, bio: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  py: 2
                }
              }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 2
      }}
    >
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(102, 126, 234, 0.15)',
        filter: 'blur(80px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(118, 75, 162, 0.15)',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-30px) translateX(30px); }
          }
        `}
      </style>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          width: '100%',
          maxWidth: 800,
          borderRadius: 5,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            fontSize: '3rem',
            mb: 2,
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🤖
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 1,
              background: 'linear-gradient(135deg, #ffffff 0%, #a8b5ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}
          >
            Welcome to PostNexus
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Let's set up your profile in just a few steps
          </Typography>
        </Box>

        {/* Step indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          {steps.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: index <= currentStep
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontWeight: 600,
                transition: 'all 0.3s'
              }}>
                {index < currentStep ? '✓' : index + 1}
              </Box>
              {index < steps.length - 1 && (
                <Box sx={{
                  width: 60,
                  height: 2,
                  background: index < currentStep
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  mx: 1,
                  transition: 'all 0.3s'
                }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Step content */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ mr: 3 }}>
            {steps[currentStep].icon}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              {steps[currentStep].title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {steps[currentStep].subtitle}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              '& .MuiAlert-icon': {
                color: '#fca5a5'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
            sx={{
              borderRadius: 3,
              px: 3,
              color: "white",
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a5fd6 0%, #6a4191 100%)',
                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              },
              transition: 'all 0.3s'
            }}
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Onboarding;