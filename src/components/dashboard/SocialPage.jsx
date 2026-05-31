import { useState, useEffect } from 'react';
import apiService from '../../services/api';

const SocialPage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [socialDialog, setSocialDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await apiService.getProfile();
        setCurrentUser(profileData.user);
        localStorage.setItem('currentUser', JSON.stringify(profileData.user));
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

    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success) {
      showSnackbar(success, 'success');
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserData();
    } else if (error) {
      showSnackbar(decodeURIComponent(error), 'error');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchUserData();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  };

  const refreshProfile = async () => {
    const profileData = await apiService.getProfile();
    setCurrentUser(profileData.user);
    localStorage.setItem('currentUser', JSON.stringify(profileData.user));
  };

  const handleSocialConnect = async (platform) => {
    try {
      if (platform === 'linkedin' || platform === 'twitter') {
        const authResponse = await apiService.initiateSocialAuth(platform);
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
      await refreshProfile();
      showSnackbar(`${platform} disconnected`, 'success');
    } catch (error) {
      console.error('Failed to disconnect social account:', error);
      showSnackbar(`Failed to disconnect ${platform}`, 'error');
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

  const platforms = [
    { platform: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700', available: true, icon: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ) },
    { platform: 'twitter', name: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600', available: false, icon: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ) },
    { platform: 'facebook', name: 'Facebook', color: 'bg-blue-700 hover:bg-blue-800', available: false, icon: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ) }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Social Accounts</h1>
        <p className="text-sm text-slate-500 mt-1">Connect your social media accounts to start automated posting.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs max-w-4xl space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Connected Social Accounts</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage authorization and connection status for each target network.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {platforms.map(({ platform, name, color, available, icon }) => {
            const isConnected = currentUser.socialConnections?.[platform]?.connected;
            return (
              <div key={platform} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between items-center text-center gap-4 hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${color}`}>
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{name}</h3>
                </div>
                <div className="w-full">
                  {isConnected ? (
                    <span className="inline-flex w-full justify-center px-3 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-100 uppercase tracking-wider">
                      Connected
                    </span>
                  ) : available ? (
                    <button
                      onClick={() => handleSocialConnect(platform)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Connect
                    </button>
                  ) : (
                    <span className="inline-flex w-full justify-center px-3 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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

export default SocialPage;