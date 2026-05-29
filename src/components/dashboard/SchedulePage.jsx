import { useState, useEffect } from 'react';
import apiService from '../../services/api';

const SchedulePage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [scheduleData, setScheduleData] = useState({
    time1: currentUser?.schedules?.[0]?.time1 || '09:00',
    time2: currentUser?.schedules?.[0]?.time2 || '15:00',
    platforms: currentUser?.schedules?.[0]?.platforms?.map(p => p.platform) || [],
    startDate: currentUser?.schedules?.[0]?.startDate ? new Date(currentUser.schedules[0].startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));

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
            time1: schedule.time1,
            time2: schedule.time2,
            platforms: schedule.platforms?.map(p => p.platform) || [],
            startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
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
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
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
        startDate: scheduleData.startDate,
        active: true
      };

      await apiService.createOrUpdateSchedule(schedulePayload);

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your automated posting times and targets.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs max-w-2xl">
        <h2 className="text-base font-bold text-slate-900 mb-1">Posting Schedule</h2>
        <p className="text-sm text-slate-400 mb-6">Set when you want your posts to be published</p>

        {currentUser.schedules?.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Schedule</h3>
            
            {currentUser.schedules.map((schedule, index) => (
              <div key={index} className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Daily Schedule</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {schedule.time1} &amp; {schedule.time2}
                    </p>
                  </div>
                  {schedule.startDate && (
                    <div className="ml-auto text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Start Date</p>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">
                        {new Date(schedule.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="h-px bg-indigo-100" />
                
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TARGET PLATFORMS</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {schedule.platforms?.map(platform => (
                      <span key={platform} className="px-2.5 py-1 bg-indigo-100/50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                        {platform}
                      </span>
                    )) || <span className="text-xs font-medium text-slate-400">None selected</span>}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setScheduleDialog(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Schedule
            </button>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center p-6">
            <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800">No schedule set</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Set up a posting schedule to automate your social media presence.
            </p>
            <button
              onClick={() => setScheduleDialog(true)}
              className="mt-6 flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Set Schedule
            </button>
          </div>
        )}
      </div>

      {/* Schedule Dialog Modal */}
      {scheduleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Set Posting Schedule</h3>
              <button onClick={() => setScheduleDialog(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">Choose two times per day for automated posting</p>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">FIRST POST TIME</label>
                <input
                  type="time"
                  value={scheduleData.time1}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, time1: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">SECOND POST TIME</label>
                <input
                  type="time"
                  value={scheduleData.time2}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, time2: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">START DATE</label>
                <input
                  type="date"
                  value={scheduleData.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                />
              </div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 mb-2">Select Platforms</h4>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleData.platforms.includes('linkedin')}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      platforms: e.target.checked
                        ? [...prev.platforms, 'linkedin']
                        : prev.platforms.filter(p => p !== 'linkedin')
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-700">LinkedIn</span>
                </label>

                <label className="flex items-center opacity-50 cursor-not-allowed">
                  <input
                    type="checkbox"
                    checked={scheduleData.platforms.includes('twitter')}
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 relative"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-500">Twitter (Coming Soon)</span>
                </label>

                <label className="flex items-center opacity-50 cursor-not-allowed">
                  <input
                    type="checkbox"
                    checked={scheduleData.platforms.includes('facebook')}
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 relative"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-500">Facebook (Coming Soon)</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setScheduleDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Alert */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 ${
            snackbar.severity === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
            'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span>{snackbar.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;