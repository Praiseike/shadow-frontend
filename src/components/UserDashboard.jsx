import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new dashboard structure
    navigate('/user/dashboard');
  }, [navigate]);

  return null;
};

export default UserDashboard;