import { useState, useEffect } from 'react';
import { Task, TaskInput, TaskFilters } from '../types/task';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      if (!supabase) throw new Error('Supabase client is not initialized');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskInput: TaskInput) => {
    try {
      if (!user) return { error: new Error('User not authenticated') };

      if (!supabase) return { data: null, error: new Error('Supabase client is not initialized') };
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskInput, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding task:', error);
      return { data: null, error };
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskInput>) => {
    try {
      if (!supabase) return { data: null, error: new Error('Supabase client is not initialized') };
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks((prev: Task[]) => prev.map((task: Task) => task.id === id ? data : task));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating task:', error);
      return { data: null, error };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (!supabase) return { error: new Error('Supabase client is not initialized') };
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { error };
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    return updateTask(id, { status: newStatus });
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.category !== 'all' && task.category !== filters.category) return false;
      return true;
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  };

  const getCategories = () => {
    const categories = new Set(tasks.map(task => task.category));
    return Array.from(categories);
  };

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    loading,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    fetchTasks,
    getTaskStats,
    getCategories
  };
}