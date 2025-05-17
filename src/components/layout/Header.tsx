import React from 'react';
import { Bell, Calendar, Mail, Menu, Settings, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import NotificationsDropdown from '../ui/NotificationsDropdown';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { state } = useAppContext();
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const unreadNotificationsCount = state.notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 h-16 z-20">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-4 rounded-full hover:bg-gray-100 lg:hidden"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-blue-900">TaskMe AI</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center mr-4">
            <div className={`flex items-center mr-4 ${state.isGmailConnected ? 'text-green-500' : 'text-gray-400'}`}>
              <Mail size={18} className="mr-1" />
              <span className="text-sm hidden md:inline">
                {state.isGmailConnected ? 'Gmail Connected' : 'Connect Gmail'}
              </span>
            </div>
            
            <div className={`flex items-center ${state.isCalendarConnected ? 'text-green-500' : 'text-gray-400'}`}>
              <Calendar size={18} className="mr-1" />
              <span className="text-sm hidden md:inline">
                {state.isCalendarConnected ? 'Calendar Connected' : 'Connect Calendar'}
              </span>
            </div>
          </div>
          
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <NotificationsDropdown 
                onClose={() => setShowNotifications(false)} 
              />
            )}
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          
          {state.user ? (
            <div className="flex items-center ml-2">
              {state.user.avatar ? (
                <img 
                  src={state.user.avatar} 
                  alt={state.user.name} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {state.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="ml-2 text-sm font-medium hidden md:inline">
                {state.user.name}
              </span>
            </div>
          ) : (
            <button className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md text-sm transition-colors">
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;