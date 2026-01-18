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
  Chip,
  Alert,
  Snackbar,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const SchedulePage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [scheduleData, setScheduleData] = useState({
    name: '',
    type: 'daily', // 'daily', 'weekdays', 'weekends', 'custom'
    times: ['09:00', '15:00'], // Array of times
    time1: '09:00', // Legacy support
    time2: '15:00', // Legacy support
    customDays: [], // For custom type: [0,1,2,3,4,5,6] (0=Sunday, 6=Saturday)
    platforms: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));

        // Update schedule data with fetched data (support both legacy and new format)
        if (profileData.user.schedules?.length > 0) {
          const schedule = profileData.user.schedules[0];
          
          // Parse times (support both legacy time1/time2 and new times array)
          let parsedTimes = [];
          if (schedule.times) {
            try {
              parsedTimes = typeof schedule.times === 'string' ? JSON.parse(schedule.times) : schedule.times;
            } catch (e) {
              parsedTimes = [];
            }
          }
          
          // Fallback to legacy format
          if (parsedTimes.length === 0) {
            if (schedule.time1) parsedTimes.push(schedule.time1);
            if (schedule.time2) parsedTimes.push(schedule.time2);
          }
          
          // Parse customDays
          let parsedCustomDays = [];
          if (schedule.customDays) {
            try {
              parsedCustomDays = typeof schedule.customDays === 'string' ? JSON.parse(schedule.customDays) : schedule.customDays;
            } catch (e) {
              parsedCustomDays = [];
            }
          }
          
          setScheduleData({
            name: schedule.name || '',
            type: schedule.type || 'daily',
            times: parsedTimes.length > 0 ? parsedTimes : ['09:00', '15:00'],
            time1: schedule.time1 || '09:00',
            time2: schedule.time2 || '15:00',
            customDays: parsedCustomDays,
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

  const handleAddTime = () => {
    setScheduleData(prev => ({
      ...prev,
      times: [...prev.times, '09:00']
    }));
  };

  const handleRemoveTime = (index) => {
    if (scheduleData.times.length <= 1) {
      showSnackbar('At least one posting time is required', 'error');
      return;
    }
    setScheduleData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const handleTimeChange = (index, newTime) => {
    setScheduleData(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? newTime : time)
    }));
  };

  const handleCustomDayToggle = (day) => {
    setScheduleData(prev => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter(d => d !== day)
        : [...prev.customDays, day].sort()
    }));
  };

  const handleScheduleSave = async () => {
    try {
      if (scheduleData.times.length === 0) {
        showSnackbar('At least one posting time is required', 'error');
        return;
      }

      if (scheduleData.platforms.length === 0) {
        showSnackbar('Please select at least one platform', 'error');
        return;
      }

      if (scheduleData.type === 'custom' && scheduleData.customDays.length === 0) {
        showSnackbar('Please select at least one day for custom schedule', 'error');
        return;
      }

      const schedulePayload = {
        name: scheduleData.name,
        type: scheduleData.type,
        times: scheduleData.times, // New format
        time1: scheduleData.times[0] || scheduleData.time1, // Legacy support
        time2: scheduleData.times[1] || scheduleData.time2, // Legacy support
        customDays: scheduleData.type === 'custom' ? scheduleData.customDays : null,
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
          Posting Schedule
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
          Configure automated posting times to maintain consistent engagement across your social platforms
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 4, sm: 5 } }}>
        {currentUser.schedules?.length > 0 ? (
          <Box>
            {currentUser.schedules.map((schedule, index) => (
              <Card
                key={index}
                sx={{
                  mb: 4,
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
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ScheduleIcon sx={{ color: 'white', fontSize: 24 }} />
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
                      Active Schedule
                    </Typography>
                  </Box>

                  {/* Schedule Type Display */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                      Schedule Type
                    </Typography>
                    <Chip
                      label={
                        schedule.type === 'daily' ? 'Daily (Every Day)' :
                        schedule.type === 'weekdays' ? 'Weekdays (Mon-Fri)' :
                        schedule.type === 'weekends' ? 'Weekends (Sat-Sun)' :
                        schedule.type === 'custom' ? 'Custom Days' : 'Daily'
                      }
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    />
                  </Box>

                  {/* Custom Days Display */}
                  {schedule.type === 'custom' && schedule.customDays && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                        Selected Days
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(() => {
                          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                          const customDays = typeof schedule.customDays === 'string' 
                            ? JSON.parse(schedule.customDays) 
                            : schedule.customDays || [];
                          return customDays.map(day => (
                            <Chip
                              key={day}
                              label={days[day]}
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}
                            />
                          ));
                        })()}
                      </Box>
                    </Box>
                  )}

                  {/* Posting Times Display */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                      Posting Times
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                      gap: 2 
                    }}>
                      {(() => {
                        // Support both new times array and legacy time1/time2
                        let times = [];
                        if (schedule.times) {
                          try {
                            times = typeof schedule.times === 'string' ? JSON.parse(schedule.times) : schedule.times;
                          } catch (e) {
                            times = [];
                          }
                        }
                        
                        // Fallback to legacy format
                        if (times.length === 0) {
                          if (schedule.time1) times.push(schedule.time1);
                          if (schedule.time2) times.push(schedule.time2);
                        }

                        return times.map((time, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2.5,
                              background: 'linear-gradient(145deg, rgba(5, 150, 105, 0.1) 0%, rgba(4, 120, 87, 0.05) 100%)',
                              borderRadius: 2,
                              border: '1px solid rgba(5, 150, 105, 0.2)',
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600, mb: 0.5, fontSize: '0.75rem' }}>
                              Time {index + 1}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.125rem' }}>
                              {time}
                            </Typography>
                          </Box>
                        ));
                      })()}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                      Target Platforms
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {schedule.platforms?.length > 0 ? schedule.platforms.map(platform => (
                        <Chip
                          key={platform}
                          label={platform.platform?.charAt(0).toUpperCase() + platform.platform?.slice(1)}
                          sx={{
                            background: platform?.platform === 'linkedin'
                              ? 'linear-gradient(135deg, #0077b5 0%, #005885 100%)'
                              : platform?.platform === 'twitter'
                                ? 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            height: 28
                          }}
                        />
                      )) : (
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                          No platforms selected
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setScheduleDialog(true)}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      borderRadius: 2,
                      py: 1.5,
                      px: 4,
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
                    Edit Schedule
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Card sx={{
            borderRadius: 3,
            border: '2px dashed rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            py: { xs: 6, sm: 8 },
            px: 4
          }}>
            <Box sx={{
              p: 2,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ScheduleIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#1e293b',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.25rem'
              }}
            >
              No Schedule Configured
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                mb: 4,
                fontSize: '1rem',
                lineHeight: 1.6,
                maxWidth: '400px',
                mx: 'auto'
              }}
            >
              Set up automated posting times to maintain consistent engagement across your social platforms
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setScheduleDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: 2,
                py: 1.5,
                px: { xs: 4, sm: 5 },
                fontWeight: 600,
                fontSize: '1rem',
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
              Create Schedule
            </Button>
          </Card>
        )}
      </Box>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialog}
        onClose={() => setScheduleDialog(false)}
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
            Configure Posting Schedule
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
            Set automated posting times and select which platforms to include in your schedule.
          </Typography>

          {/* Schedule Type Selection */}
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
              Schedule Type
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="schedule-type-label">Schedule Type</InputLabel>
              <Select
                labelId="schedule-type-label"
                id="schedule-type"
                value={scheduleData.type}
                label="Schedule Type"
                onChange={(e) => setScheduleData(prev => ({ ...prev, type: e.target.value }))}
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.15)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="daily">Daily (Every Day)</MenuItem>
                <MenuItem value="weekdays">Weekdays (Mon-Fri)</MenuItem>
                <MenuItem value="weekends">Weekends (Sat-Sun)</MenuItem>
                <MenuItem value="custom">Custom Days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Custom Days Selection (only shown when type is 'custom') */}
          {scheduleData.type === 'custom' && (
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
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  borderRadius: 2
                }} />
                Select Days
              </Typography>
              <FormGroup>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {[
                    { value: 0, label: 'Sunday' },
                    { value: 1, label: 'Monday' },
                    { value: 2, label: 'Tuesday' },
                    { value: 3, label: 'Wednesday' },
                    { value: 4, label: 'Thursday' },
                    { value: 5, label: 'Friday' },
                    { value: 6, label: 'Saturday' }
                  ].map(({ value, label }) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={scheduleData.customDays.includes(value)}
                          onChange={() => handleCustomDayToggle(value)}
                          sx={{
                            color: '#6366f1',
                            '&.Mui-checked': {
                              color: '#6366f1',
                            },
                          }}
                        />
                      }
                      label={label}
                    />
                  ))}
                </Box>
              </FormGroup>
            </Box>
          )}

          {/* Multiple Times Selection */}
          <Box sx={{ mb: { xs: 5, sm: 6 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
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
                Posting Times
              </Typography>
              <Button
                startIcon={<AddCircleIcon />}
                onClick={handleAddTime}
                size="small"
                sx={{
                  color: '#059669',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(5, 150, 105, 0.1)'
                  }
                }}
              >
                Add Time
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {scheduleData.times.map((time, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Post Time ${index + 1}`}
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    InputLabelProps={{ shrink: true }}
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
                  {scheduleData.times.length > 1 && (
                    <Button
                      onClick={() => handleRemoveTime(index)}
                      sx={{
                        minWidth: 'auto',
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.1)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Platform Selection Section */}
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
              Target Platforms
            </Typography>
            <div className="space-y-3">
              {[
                { platform: 'linkedin', label: 'LinkedIn', description: 'Professional networking', available: true, color: '#0077b5' },
                { platform: 'twitter', label: 'Twitter', description: 'Real-time engagement', available: false, color: '#1da1f2' },
                { platform: 'facebook', label: 'Facebook', description: 'Coming Soon', available: false, color: '#f59e0b' }
              ].map(({ platform, label, description, available, color }) => (
                <Card
                  key={platform}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    background: available
                      ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)'
                      : 'linear-gradient(145deg, rgba(254, 243, 199, 0.3) 0%, rgba(253, 230, 138, 0.2) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: available
                      ? '0 2px 4px rgba(0, 0, 0, 0.04)'
                      : '0 2px 4px rgba(245, 158, 11, 0.1)',
                    transition: 'all 0.2s ease',
                    opacity: available ? 1 : 0.7
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scheduleData.platforms.includes(platform)}
                          onChange={(e) => setScheduleData(prev => ({
                            ...prev,
                            platforms: e.target.checked
                              ? [...prev.platforms, platform]
                              : prev.platforms.filter(p => p !== platform)
                          }))}
                          disabled={!available}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              color: available ? color : '#d1d5db',
                              '&.Mui-checked': {
                                color: color,
                                '& + .MuiSwitch-track': {
                                  backgroundColor: `${color}40`,
                                },
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-disabled': {
                              color: '#d1d5db',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#f3f4f6'
                              }
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: available ? '#1e293b' : '#92400e',
                              fontSize: '0.95rem',
                              lineHeight: 1.2
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: available ? '#64748b' : '#d97706',
                              fontSize: '0.8rem',
                              fontWeight: 400
                            }}
                          >
                            {description}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        m: 0,
                        width: '100%',
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          flex: 1,
                          marginTop: '2px'
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
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
            onClick={() => setScheduleDialog(false)}
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
            onClick={handleScheduleSave}
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