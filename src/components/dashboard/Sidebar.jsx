import SidebarHeader from './SidebarHeader';
import NavigationList from './NavigationList';


const Sidebar = ({ onLogout }) => {
  return (
    <div className="hidden md:block w-72 flex-shrink-0 bg-gradient-to-b from-gray-800 to-gray-900 text-white border-r border-white/10">
      <SidebarHeader />
      <NavigationList onLogout={onLogout} />
    </div>
  );
};

export default Sidebar;