import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const SocialErrorPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRetry = () => {
    navigate('/user/social');
  };

  const handleGoHome = () => {
    navigate('/user/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{
        maxWidth: 500,
        width: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ mb: 4 }}>
            <ErrorIcon sx={{ fontSize: 80, color: '#f5576c' }} />
          </Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#2d3748',
              fontWeight: 700,
              mb: 2
            }}
          >
            Connection Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
            We encountered an error while connecting your social media account.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Error:</strong> {error}
              </Typography>
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={handleGoHome}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  backgroundColor: '#667eea',
                  color: 'white'
                }
              }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SocialErrorPage;