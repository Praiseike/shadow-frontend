import SidebarHeader from './SidebarHeader';
import NavigationList from './NavigationList';

const MobileSidebar = ({ open, onClose, onNavigate, onLogout }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
        <SidebarHeader />
        <div className="flex-1 overflow-y-auto">
          <NavigationList onLogout={onLogout} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;