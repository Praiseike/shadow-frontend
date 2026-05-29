import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { UserProvider } from '../../hooks/useUser';

const DashboardLayout = ({ onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = () => {
    setDrawerOpen(false);
  };

  return (
    <UserProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        {/* Mobile menu button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Sidebar */}
        <Sidebar onLogout={onLogout} />

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={handleNavigation}
          onLogout={onLogout}
        />

        {/* Main content */}
        <main className="flex-1 min-h-screen p-6 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </UserProvider>
  );
};

export default DashboardLayout;