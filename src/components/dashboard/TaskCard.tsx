import React from 'react';
import { Calendar, Clock, Mail, MoreVertical, RefreshCw, CreditCard } from 'lucide-react';
import { Task, TaskType, TaskStatus } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect }) => {
  // Function to get the task type icon
  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'email_followup':
        return <Mail size={18} />;
      case 'appointment':
        return <Calendar size={18} />;
      case 'subscription':
        return <CreditCard size={18} />;
      case 'refund':
        return <RefreshCw size={18} />;
      case 'reminder':
        return <Clock size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  // Function to get task status badge style
  const getStatusStyle = (status: TaskStatus) => {
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

  // Convert task type to readable string
  const getTaskTypeLabel = (type: TaskType) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Convert task status to readable string
  const getTaskStatusLabel = (status: TaskStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={() => onSelect(task)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="mr-2 text-blue-600">
            {getTaskTypeIcon(task.type)}
          </div>
          <span className="text-xs font-medium text-gray-600">
            {getTaskTypeLabel(task.type)}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(task.status)}`}>
            {getTaskStatusLabel(task.status)}
          </span>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <div>
          {task.dueDate && (
            <span>Due: {formatDate(new Date(task.dueDate))}</span>
          )}
        </div>
        <div className="flex items-center">
          {task.relatedEmails && task.relatedEmails.length > 0 && (
            <span className="flex items-center mr-2">
              <Mail size={14} className="mr-1" />
              {task.relatedEmails.length}
            </span>
          )}
          {task.actions && (
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {task.actions.filter(a => a.status === 'pending').length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;