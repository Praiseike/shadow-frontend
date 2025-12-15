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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SocialSuccessPage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('message');
    if (successMessage) {
      setMessage(decodeURIComponent(successMessage));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleContinue = () => {
    navigate('/user/social');
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
            <CheckCircleIcon sx={{ fontSize: 80, color: '#43e97b' }} />
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
            Connection Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
            {message || 'Your social media account has been connected successfully.'}
          </Typography>
          <Button
            variant="contained"
            onClick={handleContinue}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 4,
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
            Continue to Social Accounts
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SocialSuccessPage;