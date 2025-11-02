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
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const SchedulePage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [scheduleData, setScheduleData] = useState({
    time1: currentUser?.schedules?.[0]?.time1 || '09:00',
    time2: currentUser?.schedules?.[0]?.time2 || '15:00',
    platforms: currentUser?.schedules?.[0]?.platforms?.map(p => p.platform) || []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));

        // Update schedule data with fetched data
        if (profileData.user.schedules?.length > 0) {
          const schedule = profileData.user.schedules[0];
          setScheduleData({
            time1: schedule.time1,
            time2: schedule.time2,
            platforms: schedule.platforms?.map(p => p.platform) || []
          });
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

  const handleScheduleSave = async () => {
    try {
      const schedulePayload = {
        time1: scheduleData.time1,
        time2: scheduleData.time2,
        platforms: scheduleData.platforms,
        active: true
      };

      await apiService.createOrUpdateSchedule(schedulePayload);

      // Refresh user profile to get updated schedules
      const profileData = await apiService.getProfile();
      setCurrentUser(profileData.user);
      localStorage.setItem('currentUser', JSON.stringify(profileData.user));
      setScheduleDialog(false);
      showSnackbar('Schedule updated successfully');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      showSnackbar('Failed to update schedule', 'error');
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
        Schedule
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
            Posting Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
            Set when you want your posts to be published
          </Typography>

          {currentUser.schedules?.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>Current Schedule</Typography>
              {currentUser.schedules.map((schedule, index) => (
                <Box key={index} sx={{
                  mb: 3,
                  p: 3,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: 2,
                  color: 'white'
                }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>Post 1: {schedule.time1}</Typography>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>Post 2: {schedule.time2}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Platforms: {schedule.platforms?.join(', ') || 'None selected'}
                  </Typography>
                </Box>
              ))}
              <Button
                startIcon={<EditIcon />}
                onClick={() => setScheduleDialog(true)}
                variant="contained"
                sx={{
                  mt: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Edit Schedule
              </Button>
            </Box>
          ) : (
            <Box sx={{
              textAlign: 'center',
              py: 6,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: 3,
              border: '2px dashed #cbd5e0'
            }}>
              <ScheduleIcon sx={{ fontSize: 64, color: '#a0aec0', mb: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#2d3748', fontWeight: 600 }}>No schedule set</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
                Set up a posting schedule to automate your social media presence
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setScheduleDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                Set Schedule
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialog}
        onClose={() => setScheduleDialog(false)}
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          fontWeight: 700,
          borderRadius: '12px 12px 0 0'
        }}>
          Set Posting Schedule
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '1rem' }}>
            Choose two times per day for automated posting
          </Typography>
          <TextField
            fullWidth
            label="First Post Time"
            type="time"
            value={scheduleData.time1}
            onChange={(e) => setScheduleData(prev => ({ ...prev, time1: e.target.value }))}
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
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Second Post Time"
            type="time"
            value={scheduleData.time2}
            onChange={(e) => setScheduleData(prev => ({ ...prev, time2: e.target.value }))}
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
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>Platforms</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleData.platforms.includes('linkedin')}
                  onChange={(e) => setScheduleData(prev => ({
                    ...prev,
                    platforms: e.target.checked
                      ? [...prev.platforms, 'linkedin']
                      : prev.platforms.filter(p => p !== 'linkedin')
                  }))}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#0077b5',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#0077b5'
                      }
                    }
                  }}
                />
              }
              label="LinkedIn"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleData.platforms.includes('twitter')}
                  onChange={(e) => setScheduleData(prev => ({
                    ...prev,
                    platforms: e.target.checked
                      ? [...prev.platforms, 'twitter']
                      : prev.platforms.filter(p => p !== 'twitter')
                  }))}
                  disabled
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1da1f2',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#1da1f2'
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-disabled': {
                      color: '#ccc',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#ccc'
                      }
                    }
                  }}
                />
              }
              label="Twitter (Coming Soon)"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500, color: 'text.secondary' } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleData.platforms.includes('facebook')}
                  onChange={(e) => setScheduleData(prev => ({
                    ...prev,
                    platforms: e.target.checked
                      ? [...prev.platforms, 'facebook']
                      : prev.platforms.filter(p => p !== 'facebook')
                  }))}
                  disabled
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1877f2',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#1877f2'
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-disabled': {
                      color: '#ccc',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#ccc'
                      }
                    }
                  }}
                />
              }
              label="Facebook (Coming Soon)"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500, color: 'text.secondary' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setScheduleDialog(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #e07dd1 0%, #e74c5f 100%)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Save Schedule
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

export default SchedulePage;