import React from 'react';
import { Calendar, Flag, Tag, Edit2, Trash2, Check, Clock } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';

  return (
    <div className={`bg-white rounded-xl border-2 p-6 hover:shadow-md transition-all duration-200 ${
      task.status === 'completed' ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-start space-x-4">
        {/* Status Toggle */}
        <button
          onClick={onToggleStatus}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.status === 'completed'
              ? 'bg-green-600 border-green-600 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {task.status === 'completed' && <Check className="w-4 h-4" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
            task.status === 'completed' ? 'line-through text-gray-500' : ''
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`text-gray-600 mb-4 ${
              task.status === 'completed' ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          {/* Task Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Priority */}
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
              <Flag className="w-4 h-4" />
              <span className="capitalize">{task.priority}</span>
            </div>

            {/* Category */}
            <div className="inline-flex items-center space-x-1 text-gray-600">
              <Tag className="w-4 h-4" />
              <span className="capitalize">{task.category}</span>
            </div>

            {/* Due Date */}
            {task.due_date && (
              <div className={`inline-flex items-center space-x-1 ${
                isOverdue ? 'text-red-600' : 'text-gray-600'
              }`}>
                {isOverdue ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                <span>{formatDate(task.due_date)}</span>
                {isOverdue && <span className="text-xs font-medium">(Overdue)</span>}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}