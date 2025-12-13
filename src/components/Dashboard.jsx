import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load users from localStorage (in a real app, this would be an API call)
    const storedUsers = JSON.parse(localStorage.getItem('autopost_users') || '[]');
    setUsers(storedUsers);
  }, []);

  const addUser = () => {
    const name = prompt('Enter user name:');
    const email = prompt('Enter user email:');
    if (name && email) {
      const newUser = { id: Date.now(), name, email, topics: [] };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('autopost_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">PostNexus</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="border p-3 rounded">
                  <div className="font-semibold">{user.name || 'Unnamed User'}</div>
                  <div className="text-sm text-gray-600">{user.email || 'No email'}</div>
                  <div className="text-sm text-gray-500">Topics: {user.topics ? user.topics.join(', ') : 'None'}</div>
                </div>
              ))}
            </div>
            <button onClick={addUser} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add User
            </button>
          </div>

          {/* System Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">System Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Users:</span>
                <span className="font-semibold">{users.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Schedules:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Posts Generated:</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;