import React from 'react';
import { Check, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const { state, dispatch } = useAppContext();
  
  const markAllAsRead = () => {
    state.notifications.forEach(notification => {
      if (!notification.isRead) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
      }
    });
  };

  const handleNotificationClick = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    // Additional logic to navigate to related task if needed
  };

  // Get the notifications icon and style based on the notification type
  const getNotificationStyle = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'warning':
        return { bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
      case 'error':
        return { bgColor: 'bg-red-100', textColor: 'text-red-800' };
      default:
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-medium">Notifications</h3>
        <div className="flex items-center space-x-2">
          <button 
            className="text-xs text-blue-600 hover:text-blue-800"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {state.notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            You have no notifications
          </div>
        ) : (
          state.notifications.map(notification => {
            const style = getNotificationStyle(notification.type);
            
            return (
              <div 
                key={notification.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex">
                  <div className={`w-8 h-8 rounded-full ${style.bgColor} ${style.textColor} flex items-center justify-center flex-shrink-0 mr-3`}>
                    <Check size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.timestamp))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 text-center">
        <button className="text-xs text-blue-600 hover:text-blue-800">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;