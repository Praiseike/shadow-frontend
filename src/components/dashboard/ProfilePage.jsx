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
    <Container maxWidth="lg" sx={{
      py: { xs: 3, sm: 4 },
      minHeight: '100vh',
      background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)'
    }}>
      {/* Header Section */}
      <Box sx={{
        mb: { xs: 4, sm: 5 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 3, sm: 0 }
      }}>
        <Typography
          variant="h4"
          sx={{
            color: '#1e293b',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem' },
            letterSpacing: '-0.025em'
          }}
        >
          My Profile
        </Typography>
        <Button
          startIcon={<EditIcon />}
          onClick={() => setProfileDialog(true)}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: 2,
            px: { xs: 3, sm: 4 },
            py: 1.5,
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
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
          Edit Profile
        </Button>
      </Box>

      <Box sx={{ maxWidth: { xs: '100%', md: '75%' }, mx: 'auto' }}>
        {/* Profile Header Card */}
        <Card sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          boxShadow: '0 25px 50px -12px rgba(30, 41, 59, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          borderRadius: { xs: 3, sm: 4 },
          overflow: 'hidden',
          mb: { xs: 4, sm: 5 },
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
          <CardContent sx={{ p: { xs: 4, sm: 5 }, position: 'relative', zIndex: 1 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' },
              gap: { xs: 3, sm: 4 }
            }}>
              <Avatar sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                fontSize: { xs: '2.5rem', sm: '3rem' },
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                borderRadius: 3
              }}>
                {currentUser.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'white',
                    fontSize: { xs: '1.75rem', sm: '2.25rem' },
                    letterSpacing: '-0.025em'
                  }}
                >
                  {currentUser.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    color: 'white',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {/* Profile Information Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: { xs: 3, sm: 4 },
          mb: { xs: 4, sm: 5 }
        }}>
          {/* Occupation Card */}
          <Card sx={{
            borderRadius: 3,
            border: '1px solid rgba(0, 0, 0, 0.06)',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Work sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    fontSize: '1.125rem',
                    letterSpacing: '-0.025em'
                  }}
                >
                  Occupation
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  fontSize: '1.125rem',
                  lineHeight: 1.4
                }}
              >
                {currentUser?.profile?.occupation || 'Not specified'}
              </Typography>
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card sx={{
            borderRadius: 3,
            border: '1px solid rgba(0, 0, 0, 0.06)',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AccessTime sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    fontSize: '1.125rem',
                    letterSpacing: '-0.025em'
                  }}
                >
                  Experience
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: '#374151',
                  fontSize: '1.125rem',
                  lineHeight: 1.4
                }}
              >
                {currentUser?.profile?.experience || 'Not specified'}
              </Typography>
            </CardContent>
          </Card>
        </Box>




        {/* Bio Card */}
        <Card sx={{
          borderRadius: 3,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Info sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  fontSize: '1.125rem',
                  letterSpacing: '-0.025em'
                }}
              >
                About Me
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: '#4b5563',
                lineHeight: 1.7,
                fontSize: '1rem',
                fontWeight: 400
              }}
            >
              {currentUser?.profile?.bio || 'No bio added yet. Tell us about yourself!'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Profile Dialog */}
      <Dialog
        open={profileDialog}
        onClose={() => setProfileDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: 3, sm: 4 },
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
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
            Edit Profile
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
            Update your profile information to personalize your content generation experience.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
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
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#6366f1',
                    fontWeight: 600,
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={profileData.email}
              disabled
              helperText="Email cannot be changed"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  fontWeight: 500,
                },
                '& .MuiFormHelperText-root': {
                  color: '#9ca3af',
                  fontSize: '0.8rem',
                },
              }}
            />
            <TextField
              fullWidth
              label="Occupation"
              placeholder="e.g., Software Engineer, Product Manager"
              value={profileData.occupation}
              onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
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
            <TextField
              fullWidth
              label="Years of Experience"
              placeholder="e.g., 5 years"
              value={profileData.experience}
              onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
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
                    borderColor: '#d97706',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#d97706',
                    fontWeight: 600,
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              placeholder="Tell us about yourself..."
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
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
                    borderColor: '#7c3aed',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#7c3aed',
                    fontWeight: 600,
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 3, sm: 4 },
          pt: 0,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Button
            onClick={() => setProfileDialog(false)}
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
            onClick={handleProfileSave}
            variant="contained"
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