import React from 'react';
import { Plus, Mail, Calendar, RefreshCw, CreditCard, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import ConnectAccountsPrompt from './ConnectAccountsPrompt';
import { Task, TaskType } from '../../types';
import { mockTasks } from '../../utils/mockData';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [filterType, setFilterType] = React.useState<TaskType | 'all'>('all');
  
  // Load mock tasks for demo
  React.useEffect(() => {
    mockTasks.forEach(task => {
      dispatch({ type: 'ADD_TASK', payload: task });
    });
  }, [dispatch]);

  const filteredTasks = state.tasks.filter(task => 
    filterType === 'all' || task.type === filterType
  );
  
  const pendingTasksCount = state.tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
  
  const taskCounts = {
    email_followup: state.tasks.filter(t => t.type === 'email_followup' && t.status !== 'completed').length,
    appointment: state.tasks.filter(t => t.type === 'appointment' && t.status !== 'completed').length,
    subscription: state.tasks.filter(t => t.type === 'subscription' && t.status !== 'completed').length,
    refund: state.tasks.filter(t => t.type === 'refund' && t.status !== 'completed').length,
    reminder: state.tasks.filter(t => t.type === 'reminder' && t.status !== 'completed').length,
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  return (
    <div className="p-6">
      {/* Show connect prompt if not connected */}
      {(!state.isGmailConnected || !state.isCalendarConnected) && (
        <ConnectAccountsPrompt />
      )}
      
      {/* Dashboard header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            You have {pendingTasksCount} pending tasks to handle
          </p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={18} className="mr-2" />
          New Task
        </button>
      </div>
      
      {/* Task type filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <button 
          onClick={() => setFilterType('all')}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            filterType === 'all' 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="font-medium">All Tasks</span>
          <span className="text-sm mt-1">{pendingTasksCount}</span>
        </button>
        
        <button 
          onClick={() => setFilterType('email_followup')}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            filterType === 'email_followup' 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Mail size={20} className="mb-1" />
          <span className="font-medium">Emails</span>
          <span className="text-sm mt-1">{taskCounts.email_followup}</span>
        </button>
        
        <button 
          onClick={() => setFilterType('appointment')}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            filterType === 'appointment' 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Calendar size={20} className="mb-1" />
          <span className="font-medium">Appointments</span>
          <span className="text-sm mt-1">{taskCounts.appointment}</span>
        </button>
        
        <button 
          onClick={() => setFilterType('subscription')}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            filterType === 'subscription' 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <CreditCard size={20} className="mb-1" />
          <span className="font-medium">Subscriptions</span>
          <span className="text-sm mt-1">{taskCounts.subscription}</span>
        </button>
        
        <button 
          onClick={() => setFilterType('refund')}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
            filterType === 'refund' 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <RefreshCw size={20} className="mb-1" />
          <span className="font-medium">Refunds</span>
          <span className="text-sm mt-1">{taskCounts.refund}</span>
        </button>
      </div>
      
      {/* Tasks grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onSelect={handleTaskSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-600 mb-4">
            {filterType === 'all'
              ? "You don't have any tasks yet"
              : `You don't have any ${filterType.replace('_', ' ')} tasks`}
          </p>
          <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus size={18} className="mr-2" />
            Add New Task
          </button>
        </div>
      )}
      
      {/* Task detail modal */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={handleCloseTaskDetail}
        />
      )}
    </div>
  );
};

export default Dashboard;