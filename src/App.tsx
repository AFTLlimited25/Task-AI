import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import { AppProvider, useAppContext } from './context/AppContext';
import { mockUser, mockNotifications } from './utils/mockData';

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { dispatch } = useAppContext();

  // Initialize with mock data for demo purposes
  useEffect(() => {
    // Set mock user
    dispatch({ type: 'SET_USER', payload: mockUser });
    
    // Add mock notifications
    mockNotifications.forEach(notification => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    });
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className="pt-16 lg:pl-64">
        <Dashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;