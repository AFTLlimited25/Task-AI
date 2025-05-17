import React, { createContext, useContext, useReducer } from 'react';
import { AppState, Task, Notification, User } from '../types';

// Initial state
const initialState: AppState = {
  isGmailConnected: false,
  isCalendarConnected: false,
  user: null,
  tasks: [],
  notifications: [],
};

// Action types
type ActionType = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'CONNECT_GMAIL'; payload: boolean }
  | { type: 'CONNECT_CALENDAR'; payload: boolean }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// Reducer
const appReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CONNECT_GMAIL':
      return { 
        ...state, 
        isGmailConnected: action.payload,
        user: state.user 
          ? { ...state.user, isConnected: { ...state.user.isConnected, gmail: action.payload } } 
          : null
      };
    case 'CONNECT_CALENDAR':
      return { 
        ...state, 
        isCalendarConnected: action.payload,
        user: state.user 
          ? { ...state.user, isConnected: { ...state.user.isConnected, calendar: action.payload } } 
          : null
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        )
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};