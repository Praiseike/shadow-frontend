import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfilePage from './components/dashboard/ProfilePage';
import SocialPage from './components/dashboard/SocialPage';
import SocialSuccessPage from './components/dashboard/SocialSuccessPage';
import SocialErrorPage from './components/dashboard/SocialErrorPage';
import SchedulePage from './components/dashboard/SchedulePage';
import TopicsPage from './components/dashboard/TopicsPage';
import SettingsPage from './components/dashboard/SettingsPage';
import Terms from './components/Terms';
import Privacy from './components/Privacy';

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
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="/auth"
              element={
                currentUser ? (
                  <UserDashboard user={currentUser} onLogout={handleLogout} />
                ) : (
                  <Auth onLogin={handleLogin} />
                )
              }
            />
            <Route path="/user" element={
              <DashboardLayout onLogout={handleLogout} />}>
              <Route  index element={<DashboardHome user={currentUser} />} />
              <Route path="dashboard" element={<DashboardHome user={currentUser} />} />
              <Route path="profile" element={<ProfilePage user={currentUser} />} />
              <Route path="social" element={<SocialPage user={currentUser} />} />
              <Route path="social/success" element={<SocialSuccessPage />} />
              <Route path="social/error" element={<SocialErrorPage />} />
              <Route path="schedule" element={<SchedulePage user={currentUser} />} />
              <Route path="topics" element={<TopicsPage user={currentUser} />} />
              <Route path="settings" element={<SettingsPage user={currentUser} />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;