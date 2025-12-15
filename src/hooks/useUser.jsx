import { useState, useEffect, useContext, createContext } from 'react';
import apiService from '../services/api';

// Create a context for user data
const UserContext = createContext();

// Custom hook to use user data
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// User provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from API
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user profile
      const profileResponse = await apiService.getProfile();
      const userData = profileResponse.user;

      // Load user plan
      const planResponse = await apiService.getUserPlan();

      setUser(userData);
      setUserPlan(planResponse);

      // Update localStorage as backup
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { user: userData, plan: planResponse };
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError(err.message);

      // Fallback to localStorage
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        const localUser = JSON.parse(saved);
        setUser(localUser);
        return { user: localUser, plan: null };
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await apiService.updateProfile(userData);
      const updatedUser = response.user;

      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  };

  // Refresh user plan data
  const refreshUserPlan = async () => {
    try {
      const planResponse = await apiService.getUserPlan();
      setUserPlan(planResponse);
      return planResponse;
    } catch (err) {
      console.error('Failed to refresh user plan:', err);
      throw err;
    }
  };

  // Login user
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // Logout user
  const logoutUser = () => {
    setUser(null);
    setUserPlan(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  // Initialize user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const value = {
    user,
    userPlan,
    loading,
    error,
    loadUserData,
    updateUser,
    refreshUserPlan,
    loginUser,
    logoutUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default useUser;