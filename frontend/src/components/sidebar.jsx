

// Sidebar.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBoxes, FaUpload, FaCalendarAlt, FaShoppingCart, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-white shadow-md h-screen fixed top-0 left-0 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        {/* Toggle Button */}
        <div className="p-4">
          <button
            className="p-3 bg-orange-500 text-white font-bold rounded"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>

        {/* Sidebar items */}
        <div className="p-4 flex flex-col justify-between h-full space-y-4 ">
          {/* Upper section items */}
          <div className="space-y-4">
            <SidebarItem text="Dashboard" icon={FaTachometerAlt} active={!isCollapsed} onClick={() => navigate('/dashboard')} />
            <SidebarItem text="Inventory" icon={FaBoxes} active={!isCollapsed} onClick={() => navigate('/inventory')} />
            <SidebarItem text="Upload Document" icon={FaUpload} active={!isCollapsed} onClick={() => navigate('/upload')} />
            <SidebarItem text="Calendar" icon={FaCalendarAlt} active={!isCollapsed} onClick={() => navigate('/schedule')} />
            <SidebarItem text="Orders" icon={FaShoppingCart} active={!isCollapsed} onClick={() => navigate('/orders')} />
          </div>
        </div>
      </div>
      {/* Content area */}
      <div className={`${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 flex-1`}>
        {/* Other content will go here */}
      </div>
    </div>
  );
};

// SidebarItem component
const SidebarItem = ({ text, icon: Icon, active, onClick }) => (
  <div 
    className={`p-2 flex items-center space-x-2 hover:cursor-pointer hover:bg-gray-200 
      ${active ? 'bg-gray-100 text-black-600 font-semibold rounded' : 'hover:bg-gray-200'}`}
    onClick={onClick}
  >
    <Icon className="w-6 h-6 text-gray-500" />
    <span className={`${active ? 'block' : 'hidden'}`}>{text}</span>
  </div>
);

export default Sidebar;