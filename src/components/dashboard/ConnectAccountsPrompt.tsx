import React from 'react';
import { Mail, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const ConnectAccountsPrompt: React.FC = () => {
  const { state, dispatch } = useAppContext();

  // These would normally connect to the real APIs
  const handleConnectGmail = () => {
    dispatch({ type: 'CONNECT_GMAIL', payload: true });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: {
        id: crypto.randomUUID(),
        type: 'success',
        message: 'Successfully connected to Gmail',
        timestamp: new Date().toISOString(),
        isRead: false
      }
    });
  };

  const handleConnectCalendar = () => {
    dispatch({ type: 'CONNECT_CALENDAR', payload: true });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: {
        id: crypto.randomUUID(),
        type: 'success',
        message: 'Successfully connected to Google Calendar',
        timestamp: new Date().toISOString(),
        isRead: false
      }
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-medium text-blue-900 mb-2">
        Connect your accounts to get started
      </h2>
      <p className="text-blue-800 mb-4">
        TaskMe AI needs access to your email and calendar to help manage your life admin tasks.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gmail connection card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Mail size={24} className="text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium">Connect Gmail</h3>
              <p className="text-sm text-gray-600">For email tasks and follow-ups</p>
            </div>
          </div>
          {state.isGmailConnected ? (
            <CheckCircle2 size={24} className="text-green-500" />
          ) : (
            <button 
              onClick={handleConnectGmail}
              className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
            >
              Connect
              <ArrowRight size={16} className="ml-1" />
            </button>
          )}
        </div>
        
        {/* Calendar connection card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar size={24} className="text-blue-600 mr-3" />
            <div>
              <h3 className="font-medium">Connect Calendar</h3>
              <p className="text-sm text-gray-600">For appointments and scheduling</p>
            </div>
          </div>
          {state.isCalendarConnected ? (
            <CheckCircle2 size={24} className="text-green-500" />
          ) : (
            <button 
              onClick={handleConnectCalendar}
              className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
            >
              Connect
              <ArrowRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectAccountsPrompt;