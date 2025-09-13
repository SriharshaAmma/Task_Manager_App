export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  category: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  category: string;
  status: "pending" | "completed";
}

export type TaskInput = Omit<Task, "id">;


export interface TaskFilters {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: string;
}