'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { formatDate, isTaskOverdue, statusColors, cn } from '@/lib/utils';
import { useUpdateTaskMutation } from '@/store/services/api';
import {
  Calendar,
  AlertCircle,
  Pencil,
  Trash2,
  ArrowRightCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const isOverdue = isTaskOverdue(task.dueDate, task.status);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTask({
        id: task._id,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md',
        isOverdue
          ? 'border-red-200 hover:border-red-300'
          : 'border-gray-200 hover:border-indigo-200'
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="mt-1.5 text-xs text-gray-600 line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          {/* Due date info */}
          <div
            className={cn(
              'flex items-center gap-1.5 font-medium',
              isOverdue ? 'text-red-600' : 'text-gray-500'
            )}
            title={isOverdue ? 'Task is overdue!' : `Due ${formatDate(task.dueDate)}`}
          >
            {isOverdue ? (
              <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
            )}
            <span>{formatDate(task.dueDate)}</span>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border',
              statusColors[task.status].badge
            )}
          >
            <span
              className={cn('h-1.5 w-1.5 rounded-full', statusColors[task.status].dot)}
            />
            {statusColors[task.status].label}
          </span>
        </div>

        {/* Quick status transitions */}
        <div className="flex items-center gap-1.5 pt-1">
          {task.status === 'todo' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-1 rounded-md bg-blue-50 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Clock className="h-3 w-3" />
              <span>Start</span>
            </button>
          )}

          {task.status === 'in-progress' && (
            <>
              <button
                onClick={() => handleStatusChange('todo')}
                disabled={isUpdating}
                className="flex-1 rounded-md bg-gray-50 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={() => handleStatusChange('done')}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-1 rounded-md bg-emerald-50 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Done</span>
              </button>
            </>
          )}

          {task.status === 'done' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-1 rounded-md bg-gray-50 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <ArrowRightCircle className="h-3 w-3" />
              <span>Reopen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
