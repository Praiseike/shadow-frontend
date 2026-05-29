import SidebarHeader from './SidebarHeader';
import NavigationList from './NavigationList';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-r border-slate-200/80 h-screen sticky top-0">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto">
        <NavigationList onLogout={onLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;