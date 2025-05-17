import { create } from 'zustand';
import { Task, TaskStatus, TaskType } from '../types';
import { supabase } from '../lib/supabase';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  filterTasks: (type?: TaskType, status?: TaskStatus) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  addTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...task,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ tasks: [...state.tasks, data as Task] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...data } as Task : task
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data as Task[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  filterTasks: (type, status) => {
    const { tasks } = get();
    return tasks.filter(task => 
      (!type || task.type === type) && 
      (!status || task.status === status)
    );
  },
}));