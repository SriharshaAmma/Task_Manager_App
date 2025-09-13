// src/types/task.ts
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: string | null; // always null if empty
  priority: 'low' | 'medium' | 'high';
  category: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>;

export interface TaskFilters {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: string;
}
