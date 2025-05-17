import React from 'react';
import { X, Send, Calendar, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Task, TaskStatus, TaskAction, RelatedEmail } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatDateTime } from '../../utils/dateUtils';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { dispatch } = useAppContext();
  const [status, setStatus] = React.useState<TaskStatus>(task.status);
  
  // Update task status
  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: { 
          status: newStatus,
          ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {})
        }
      }
    });
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: crypto.randomUUID(),
        type: 'success',
        message: `Task "${task.title}" marked as ${newStatus.replace('_', ' ')}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        relatedTaskId: task.id
      }
    });
  };

  // Execute a pending action
  const executeAction = (action: TaskAction) => {
    // In a real app, this would call an API to execute the action
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: {
          actions: task.actions.map(a => 
            a.id === action.id 
              ? { ...a, status: 'completed', completedAt: new Date().toISOString() } 
              : a
          )
        }
      }
    });
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: crypto.randomUUID(),
        type: 'success',
        message: `Action completed for "${task.title}"`,
        timestamp: new Date().toISOString(),
        isRead: false,
        relatedTaskId: task.id
      }
    });
  };

  // Format action type to readable string
  const formatActionType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get action icon based on action type
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email':
        return <Send size={16} />;
      case 'schedule_event':
        return <Calendar size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting_response':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Task metadata */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeStyle(status)}`}>
              {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
            
            {task.priority && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            )}
            
            {task.dueDate && (
              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 flex items-center">
                <Calendar size={14} className="mr-1" />
                Due: {formatDateTime(task.dueDate)}
              </span>
            )}
          </div>
          
          {/* Task description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
          </div>
          
          {/* Related emails */}
          {task.relatedEmails && task.relatedEmails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Related Emails</h3>
              <div className="space-y-2">
                {task.relatedEmails.map((email: RelatedEmail) => (
                  <div key={email.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{email.subject}</span>
                      <span className="text-xs text-gray-500">{formatDateTime(email.receivedAt)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">From: {email.sender}</div>
                    <p className="text-sm text-gray-600">{email.snippet}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Task actions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Pending Actions</h3>
            <div className="space-y-2">
              {task.actions.filter(action => action.status !== 'completed').length === 0 ? (
                <p className="text-gray-500 text-sm">No pending actions</p>
              ) : (
                task.actions
                  .filter(action => action.status !== 'completed')
                  .map(action => (
                    <div key={action.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="mr-3 text-blue-600">
                          {getActionIcon(action.type)}
                        </div>
                        <div>
                          <div className="font-medium">{formatActionType(action.type)}</div>
                          <div className="text-sm text-gray-600">
                            {action.scheduledFor 
                              ? `Scheduled for: ${formatDateTime(action.scheduledFor)}`
                              : 'Ready to execute'}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => executeAction(action)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition-colors"
                      >
                        Execute
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
          
          {/* Completed actions */}
          {task.actions.filter(action => action.status === 'completed').length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Completed Actions</h3>
              <div className="space-y-2">
                {task.actions
                  .filter(action => action.status === 'completed')
                  .map(action => (
                    <div key={action.id} className="flex items-center border border-gray-200 bg-gray-50 rounded-lg p-3">
                      <div className="mr-3 text-green-600">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{formatActionType(action.type)}</div>
                        {action.completedAt && (
                          <div className="text-sm text-gray-600">
                            Completed on: {formatDateTime(action.completedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        
        {/* Footer actions */}
        <div className="border-t border-gray-200 p-4 flex flex-wrap justify-between gap-2">
          <div>
            <select 
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_response">Waiting Response</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <RefreshCw size={18} className="mr-2" />
              Run AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;