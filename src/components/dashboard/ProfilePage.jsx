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
  CircularProgress,
  Divider
} from '@mui/material';
import { Edit as EditIcon, Person, Work, AccessTime, Info } from '@mui/icons-material';
import { useUser } from '../../hooks/useUser';

const ProfilePage = ({ user }) => {
  const { user: currentUser, loading, updateUser } = useUser();
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
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        occupation: currentUser.occupation || '',
        experience: currentUser.experience || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={50} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            color: '#2d3748',
            fontWeight: 700
          }}
        >
          My Profile
        </Typography>
        <Button
          startIcon={<EditIcon />}
          onClick={() => setProfileDialog(true)}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 3,
            py: 1.2,
            fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)'
            }
          }}
        >
          Edit Profile
        </Button>
      </Box>

      <div className="flex flex-col gap-y-4 w-full md:w-[70%]">
        {/* Profile Header Card */}
        <Card sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 10px 30px -5px rgba(102, 126, 234, 0.3)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Avatar sx={{
                width: 120,
                height: 120,
                mr: { xs: 0, sm: 4 },
                mb: { xs: 2, sm: 0 },
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                border: '4px solid rgba(255, 255, 255, 0.4)',
                fontSize: '3rem',
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
              }}>
                {currentUser.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                  {currentUser.name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95, color: 'white', fontWeight: 400 }}>
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <div className="flex items-center flex-col md:flex-row gap-4">
          {/* Profile Details Cards */}
          <Card className='w-full md:w-1/2' sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work sx={{ color: '#667eea', mr: 1.5, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                  Occupation
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#4a5568' }}>
                {currentUser?.profile?.occupation || 'Not specified'}
              </Typography>
            </CardContent>
          </Card>

          <Card className='w-full md:w-1/2' sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ color: '#764ba2', mr: 1.5, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                  Experience
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#4a5568' }}>
                {currentUser?.profile?.experience || 'Not specified'}
              </Typography>
            </CardContent>
          </Card>
        </div>




        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ color: '#667eea', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                About Me
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.8, fontSize: '1.05rem' }}>
              {currentUser?.profile?.bio || 'No bio added yet. Tell us about yourself!'}
            </Typography>
          </CardContent>
        </Card>

      </div>

      {/* Profile Dialog */}
      <Dialog
        open={profileDialog}
        onClose={() => setProfileDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.5rem',
          py: 2.5
        }}>
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={profileData.email}
            disabled
            helperText="Email cannot be changed"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Occupation"
            placeholder="e.g., Software Engineer, Product Manager"
            value={profileData.occupation}
            onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Years of Experience"
            placeholder="e.g., 5 years"
            value={profileData.experience}
            onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            placeholder="Tell us about yourself..."
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setProfileDialog(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              color: '#4a5568'
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
              py: 1,
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)'
              }
            }}
          >
            Save Changes
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
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;