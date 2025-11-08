import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import apiService from '../services/api';

const Auth = ({ onLogin }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleGoogleLogin = () => {
    // For demo purposes, simulate Google login
    const mockUser = {
      id: Date.now(),
      name: 'Demo User',
      email: 'demo@example.com',
      profile: {
        occupation: '',
        experience: '',
        bio: ''
      },
      topics: [],
      socialConnections: {},
      schedules: []
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (tabValue === 0) { // Login
        response = await apiService.login({
          email: formData.email,
          password: formData.password
        });
      } else { // Sign up
        if (!formData.email || !formData.password || !formData.name) {
          throw new Error('All fields are required');
        }

        response = await apiService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
      }

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      onLogin(response.user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
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
          maxWidth: 480,
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
            PostNexus
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            AI-Powered Social Media on Autopilot
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3,
          p: 0.5
        }}>
          <Button
            fullWidth
            onClick={() => setTabValue(0)}
            sx={{
              py: 1.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              background: tabValue === 0 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'transparent',
              color: 'white',
              boxShadow: tabValue === 0 
                ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                : 'none',
              '&:hover': {
                background: tabValue === 0
                  ? 'linear-gradient(135deg, #5a5fd6 0%, #6a4191 100%)'
                  : 'rgba(255, 255, 255, 0.05)'
              },
              transition: 'all 0.3s'
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={() => setTabValue(1)}
            sx={{
              py: 1.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              background: tabValue === 1 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'transparent',
              color: 'white',
              boxShadow: tabValue === 1 
                ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                : 'none',
              '&:hover': {
                background: tabValue === 1
                  ? 'linear-gradient(135deg, #5a5fd6 0%, #6a4191 100%)'
                  : 'rgba(255, 255, 255, 0.05)'
              },
              transition: 'all 0.3s'
            }}
          >
            Sign Up
          </Button>
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

        {/* <Box sx={{ mb: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              py: 2,
              borderRadius: 3,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              },
              transition: 'all 0.3s'
            }}
          >
            Continue with Google
          </Button>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            my: 3
          }}>
            <Box sx={{
              flex: 1,
              height: '1px',
              background: 'rgba(255, 255, 255, 0.1)'
            }} />
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 600
              }}
            >
              or
            </Typography>
            <Box sx={{
              flex: 1,
              height: '1px',
              background: 'rgba(255, 255, 255, 0.1)'
            }} />
          </Box>
        </Box> */}

        {tabValue === 1 && (
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={handleInputChange('name')}
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
                py: 2
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
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
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.6)',
            },
            '& .MuiInputBase-input': {
              color: 'white',
              py: 2
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange('password')}
          sx={{ 
            mb: 4,
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
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.6)',
            },
            '& .MuiInputBase-input': {
              color: 'white',
              py: 2
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleEmailAuth}
          disabled={loading}
          sx={{
            py: 2,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a5fd6 0%, #6a4191 100%)',
              boxShadow: '0 16px 56px rgba(102, 126, 234, 0.7)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)'
            },
            transition: 'all 0.3s'
          }}
        >
          {loading ? 'Please wait...' : (tabValue === 0 ? 'Login to PostNexus' : 'Create Account')}
        </Button>

        {tabValue === 0 && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              mt: 3
            }}
          >
            Don't have an account?{' '}
            <Box 
              component="span" 
              sx={{ 
                color: '#a8b5ff',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={() => setTabValue(1)}
            >
              Sign up free
            </Box>
          </Typography>
        )}

        {tabValue === 1 && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              mt: 3,
              fontSize: '0.9rem'
            }}
          >
            ✓ No credit card required  •  ✓ 14-day free trial
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Auth;