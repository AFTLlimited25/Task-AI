export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isConnected: {
    gmail: boolean;
    calendar: boolean;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  relatedEmails?: RelatedEmail[];
  relatedEvents?: RelatedEvent[];
  actions: TaskAction[];
}

export type TaskType = 
  | 'email_followup' 
  | 'appointment' 
  | 'subscription' 
  | 'refund' 
  | 'reminder'
  | 'other';

export type TaskStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'waiting_response' 
  | 'completed' 
  | 'cancelled';

export type TaskPriority = 
  | 'low' 
  | 'medium' 
  | 'high';

export interface TaskAction {
  id: string;
  taskId: string;
  type: ActionType;
  status: ActionStatus;
  scheduledFor?: string;
  completedAt?: string;
  details: Record<string, any>;
}

export type ActionType = 
  | 'send_email' 
  | 'schedule_event' 
  | 'make_call' 
  | 'check_status' 
  | 'custom';

export type ActionStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed';

export interface RelatedEmail {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  snippet: string;
  isRead: boolean;
}

export interface RelatedEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedTaskId?: string;
}

export interface AppState {
  isGmailConnected: boolean;
  isCalendarConnected: boolean;
  user: User | null;
  tasks: Task[];
  notifications: Notification[];
}