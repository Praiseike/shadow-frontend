import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import apiService from '../../services/api';

const ProfilePage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [profileDialog, setProfileDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    occupation: currentUser?.occupation || '',
    experience: currentUser?.experience || '',
    bio: currentUser?.bio || ''
  });

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
        Profile
      </Typography>

      <Card sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white'
          }}>
            <Avatar sx={{
              width: 100,
              height: 100,
              mr: 3,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              fontSize: '2rem',
              fontWeight: 700
            }}>
              {currentUser.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{currentUser.name}</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {currentUser.email}
              </Typography>
            </Box>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setProfileDialog(true)}
              variant="contained"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Edit Profile
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{
                p: 3,
                background: '#818181',
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1, fontWeight: 600 }}>Occupation</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{currentUser.occupation || 'Not set'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{
                p: 3,
                background: '#818181',
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1, fontWeight: 600 }}>Experience</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{currentUser.experience || 'Not set'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{
                p: 3,
                background: '#818181',
                borderRadius: 2,
                color: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1, fontWeight: 600 }}>Bio</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {currentUser.bio || 'No bio yet'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
        <DialogContent sx={{ p: 4}}>
          <TextField
            fullWidthEdit Pro
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            sx={{
              mb: 3,
              mt: 8,
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

export default ProfilePage;