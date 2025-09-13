import React, { useState } from 'react';
import { Plus, LogOut, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskModal } from './Taskmodal';
import { TaskFilters } from './TaskFilters';
import { TaskStats } from './TaskStats';
import type { Task } from '../types/task';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const {
    tasks = [],
    loading = false,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTaskStats,
    getCategories,
    filters,
    setFilters,
  } = useTasks() || {};

  const typedTasks: Task[] = tasks as Task[];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const stats = getTaskStats ? getTaskStats() : { total: 0, completed: 0, pending: 0, completionRate: 0 };
  const categories = getCategories ? getCategories() : [];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.error) {
        const errorMessage =
          typeof result.error === 'object' && result.error !== null && 'message' in result.error
            ? (result.error as { message?: string }).message
            : undefined;
        alert('Error deleting task: ' + (errorMessage || 'Unknown error'));
      }
    }
  };

  const handleToggleStatus = async (id: string, status: 'pending' | 'completed') => {
    const result = await toggleTaskStatus(id, status);
    if (result.error) {
      const errorMessage =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? (result.error as { message?: string }).message
          : undefined;
      alert('Error updating task: ' + (errorMessage || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">TM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.user_metadata?.name ?? user?.email ?? "Guest"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
                className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center transition-colors"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button 
                onClick={handleCreateTask} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </button>
              <button 
                onClick={handleSignOut} 
                className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Statistics */}
        <TaskStats stats={stats} />

        {/* Filters */}
        {isFiltersOpen && (
          <div className="mb-6">
            <TaskFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
              categories={categories} 
            />
          </div>
        )}

        {/* Tasks Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
            <div className="flex items-center space-x-4">
              <p className="text-gray-500">{typedTasks.length} tasks</p>
              {stats.completionRate !== undefined && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{stats.completionRate}%</span> completed
                </div>
              )}
            </div>
          </div>

          {typedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first task</p>
              <button 
                onClick={handleCreateTask} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onToggleStatus={() => handleToggleStatus(task.id, task.status)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={async (taskInput) => {
            const result = await addTask(taskInput);
            // Always return an object with both data and error properties
            if ('data' in result && 'error' in result) {
              return { data: result.data ?? null, error: result.error ?? null };
            }
            // Fallback for unexpected structure
            return { data: null, error: 'Unknown error' };
          }}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}