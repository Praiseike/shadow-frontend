import { useState, useEffect } from 'react';
import apiService from '../../services/api';

const SettingsPage = ({ user }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoPost: false,
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  });

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const userData = JSON.parse(saved);
      setCurrentUser(userData);
      if (userData.timezone) {
        setSettings(prev => ({
          ...prev,
          timezone: userData.timezone
        }));
      }
    }
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const profileData = {
        timezone: settings.timezone
      };
      await apiService.updateProfile(profileData);

      const updatedUser = {
        ...currentUser,
        timezone: settings.timezone,
        settings: settings
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      showSnackbar('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showSnackbar('Failed to save settings. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your PostNexus preferences.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs max-w-2xl space-y-6">
        <h2 className="text-base font-bold text-slate-900">Application Settings</h2>
        
        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">Email notifications</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">Push notifications</span>
            </label>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Posting Preferences */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posting Preferences</h3>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoPost}
              onChange={(e) => handleSettingChange('autoPost', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
            <span className="ml-3 text-xs font-semibold text-slate-700">Auto-post generated content</span>
          </label>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</h3>
          <div className="max-w-xs">
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Language & Region */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Language & Region</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Europe/Paris">Paris (CET/CEST)</option>
                <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                <option value="Africa/Lagos">Lagos (WAT)</option>
                <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                <option value="America/Sao_Paulo">São Paulo (BRT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Settings
          </button>
        </div>
      </div>

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

export default SettingsPage;