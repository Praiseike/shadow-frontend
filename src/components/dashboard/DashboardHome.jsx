import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import apiService from '../../services/api';

const DashboardHome = () => {
  const { user: currentUser, userPlan, loading: userLoading, updateUser } = useUser();
  const [profileDialog, setProfileDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [topicDialog, setTopicDialog] = useState(false);
  const [socialDialog, setSocialDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    occupation: currentUser?.occupation || '',
    experience: currentUser?.experience || '',
    bio: currentUser?.bio || ''
  });

  const [scheduleData, setScheduleData] = useState({
    time1: currentUser?.schedules?.[0]?.time1 || '09:00',
    time2: currentUser?.schedules?.[0]?.time2 || '15:00',
    platforms: currentUser?.schedules?.[0]?.platforms?.map(p => p.platform) || []
  });

  const [selectedTopics, setSelectedTopics] = useState(currentUser?.topics?.map(t => t.topic) || []);
  const [customTopic, setCustomTopic] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingDashboard(true);
        const data = await apiService.getDashboardOverview();
        setDashboardData(data.overview);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        showSnackbar('Failed to load dashboard data', 'error');
      } finally {
        setLoadingDashboard(false);
      }
    };

    if (!userLoading) {
      fetchDashboardData();
    }
  }, [userLoading]);

  const predefinedTopics = [
    'clean code practices',
    'debugging techniques',
    'code review tips',
    'performance optimization',
    'software architecture',
    'testing strategies',
    'developer productivity',
    'refactoring patterns',
    'API design',
    'database optimization',
    'git workflows',
    'CI/CD best practices',
    'microservices vs monoliths',
    'technical debt management',
    'security best practices'
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
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
      showSnackbar(error.message || 'Failed to update profile', 'error');
    }
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
      setScheduleDialog(false);
      showSnackbar('Schedule updated successfully');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      showSnackbar(error.message || 'Failed to update schedule', 'error');
    }
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim() && !selectedTopics.includes(customTopic.trim())) {
      setSelectedTopics(prev => [...prev, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const handleTopicsSave = async () => {
    try {
      await apiService.updateTopics(selectedTopics);
      setTopicDialog(false);
      showSnackbar('Topics updated successfully');
    } catch (error) {
      console.error('Failed to save topics:', error);
      showSnackbar(error.message || 'Failed to update topics', 'error');
    }
  };

  const handleSocialConnect = async (platform) => {
    try {
      if (platform === 'linkedin' || platform === 'twitter') {
        const authResponse = await apiService.initiateSocialAuth(platform);
        setSocialDialog(false);
        window.location.href = authResponse.authUrl;
      } else {
        showSnackbar(`${platform} connection not yet implemented`, 'warning');
      }
    } catch (error) {
      console.error('Failed to initiate social auth:', error);
      showSnackbar(`Failed to connect ${platform}`, 'error');
    }
  };

  const handleSocialDisconnect = async (platform) => {
    try {
      await apiService.disconnectSocial(platform);
      await loadUserData();
      showSnackbar(`${platform} disconnected`, 'success');
    } catch (error) {
      console.error('Failed to disconnect social account:', error);
      showSnackbar(`Failed to disconnect ${platform}`, 'error');
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const stats = dashboardData ? [
    {
      title: 'Connected Accounts',
      value: dashboardData.stats.connectedAccounts,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      bg: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Active Schedules',
      value: dashboardData.stats.activeSchedules,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Selected Topics',
      value: dashboardData.stats.selectedTopics,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      bg: 'bg-cyan-50 text-cyan-600'
    },
    {
      title: 'Generated Posts',
      value: dashboardData.stats.totalGenerated,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bg: 'bg-violet-50 text-violet-600'
    },
    {
      title: 'Posted Successfully',
      value: dashboardData.stats.totalPosted,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Posted This Week',
      value: dashboardData.stats.postsThisWeek,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: 'bg-amber-50 text-amber-600'
    }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back, {currentUser?.name}! Here's your overview.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Contents */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Plan Card */}
          {(userPlan || dashboardData?.plan) && (
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm border border-indigo-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">CURRENT PLAN</span>
                  <h2 className="text-xl font-bold mt-1">
                    {dashboardData?.plan?.name || userPlan?.plan?.name || 'Free Trial'}
                  </h2>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/70">Posts/Week</p>
                  <p className="text-lg font-bold mt-0.5">
                    {dashboardData?.plan?.postsPerWeek || userPlan?.postsPerWeek || 2}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Used This Week</p>
                  <p className="text-lg font-bold mt-0.5">
                    {dashboardData?.plan?.postsThisWeek || userPlan?.postsThisWeek || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Remaining</p>
                  <p className="text-lg font-bold mt-0.5">
                    {dashboardData?.plan?.remainingPosts || userPlan?.remainingPosts || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[8rem]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">Recent Activity</h3>
            {dashboardData?.recentPosts && dashboardData.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-600 tracking-wider">
                          {post.platform}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded tracking-wider ${
                          post.status === 'posted' ? 'bg-emerald-50 text-emerald-600' :
                          post.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {post.content}
                    </p>
                    {post.error && (
                      <p className="text-xs text-rose-600 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                        Error: {post.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 font-medium">No recent activity yet</p>
                <p className="text-xs text-slate-400 mt-1">Connect your accounts and set up a schedule to start.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setSocialDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
              >
                Connect Accounts
              </button>
              
              <button
                onClick={() => setScheduleDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                Set Schedule
              </button>
              
              <button
                onClick={() => setTopicDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                Choose Topics
              </button>
            </div>

            <div className="h-px bg-slate-100" />

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Getting Started</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Connect accounts</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Link LinkedIn or Twitter profile</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Choose topics</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Select content topics</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Set posting schedule</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Automate your social calendar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">SECOND POST TIME</label>
                <input
                  type="time"
                  value={scheduleData.time2}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, time2: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm"
                />
              </div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Select Platforms</h4>
              <div className="space-y-2">
                {['linkedin', 'twitter', 'facebook'].map((platform) => (
                  <label key={platform} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleData.platforms.includes(platform)}
                      onChange={(e) => setScheduleData(prev => ({
                        ...prev,
                        platforms: e.target.checked
                          ? [...prev.platforms, platform]
                          : prev.platforms.filter(p => p !== platform)
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                    <span className="ml-3 text-xs font-semibold text-slate-700 capitalize">{platform}</span>
                  </label>
                ))}
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

      {/* Topics Dialog Modal */}
      {topicDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Choose Content Topics</h3>
              <button onClick={() => setTopicDialog(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <p className="text-xs text-slate-500 mb-4">Select topics for your AI-generated posts</p>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Predefined Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {predefinedTopics.map(topic => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => handleTopicToggle(topic)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add Custom Topic</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom topic"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTopic()}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs"
                  />
                  <button
                    onClick={handleAddCustomTopic}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              {selectedTopics.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Topics ({selectedTopics.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map(topic => (
                      <span key={topic} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold">
                        {topic}
                        <button onClick={() => handleTopicToggle(topic)} className="hover:text-indigo-900">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setTopicDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopicsSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Save Topics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Connection Dialog Modal */}
      {socialDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Connect Social Accounts</h3>
              <button onClick={() => setSocialDialog(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 mb-2">Connect your accounts to enable automated posting</p>
              
              <div className="space-y-3">
                {[
                  { platform: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
                  { platform: 'twitter', name: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
                  { platform: 'facebook', name: 'Facebook', color: 'bg-blue-700 hover:bg-blue-800' }
                ].map(({ platform, name, color }) => {
                  const isConnected = currentUser?.socialConnections?.[platform]?.connected;
                  return (
                    <div key={platform} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-700">{name}</span>
                      {isConnected ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase">
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSocialConnect(platform)}
                          className={`px-3 py-1.5 text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-xs ${color}`}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSocialDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Alert */}
      {snackbar.open && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-w-md">
            {snackbar.severity === 'error' ? (
              <div className="flex-shrink-0 p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : snackbar.severity === 'warning' ? (
              <div className="flex-shrink-0 p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <span className="text-sm font-semibold text-slate-800 pr-2 leading-tight">{snackbar.message}</span>
            <button
              onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
              className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardHome;