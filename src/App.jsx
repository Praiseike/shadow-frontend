import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import apiService from './services/api';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfilePage from './components/dashboard/ProfilePage';
import SocialPage from './components/dashboard/SocialPage';
import SocialSuccessPage from './components/dashboard/SocialSuccessPage';
import SocialErrorPage from './components/dashboard/SocialErrorPage';
import SchedulePage from './components/dashboard/SchedulePage';
import TopicsPage from './components/dashboard/TopicsPage';
import PlansPage from './components/dashboard/PlansPage';
import SettingsPage from './components/dashboard/SettingsPage';
import ScheduledPostsPage from './components/dashboard/ScheduledPostsPage';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Onboarding from './components/Onboarding';
import AdminDashboard from './components/AdminDashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Navigation-aware component to set up API service
function AppContent({ handleLogin }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Set navigate function in API service for 401 redirects
    apiService.setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route
        path="/auth"
        element={
          <Auth onLogin={(user) => {
            // Auth.jsx already persists token + navigates; this callback
            // keeps the App-level currentUser state in sync.
            handleLogin(user);
          }} />
        }
      />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/user" element={<DashboardLayout onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        navigate('/auth');
      }} />}>
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="social" element={<SocialPage />} />
        <Route path="social/success" element={<SocialSuccessPage />} />
        <Route path="social/error" element={<SocialErrorPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="posts/scheduled" element={<ScheduledPostsPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="plans/payment/callback" element={<PlansPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <div className="App">
            <AppContent handleLogin={handleLogin} />
          </div>
        </Router>
    </ThemeProvider>
  );
}

export default App;
