import React from 'react';
import { Calendar, Home, Mail, RefreshCw, LayoutDashboard, Clock, FileClock, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'tasks', label: 'My Tasks', icon: <Clock size={20} /> },
    { id: 'emails', label: 'Email Tasks', icon: <Mail size={20} />, disabled: !state.isGmailConnected },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, disabled: !state.isCalendarConnected },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={20} /> },
    { id: 'refunds', label: 'Refunds', icon: <RefreshCw size={20} /> },
    { id: 'reminders', label: 'Reminders', icon: <FileClock size={20} /> },
    { divider: true },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} /> }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" />
      )}
      <aside 
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => 
                item.divider ? (
                  <li key={`divider-${index}`} className="my-4 border-t border-gray-200" />
                ) : (
                  <li key={item.id}>
                    <button
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                      onClick={() => !item.disabled && setActiveTab(item.id)}
                      disabled={item.disabled}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-medium text-blue-800 text-sm">Need help?</h3>
              <p className="text-blue-600 text-xs mt-1">
                Our AI can manage more tasks for you.
              </p>
              <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md text-xs transition-colors">
                Explore Capabilities
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;