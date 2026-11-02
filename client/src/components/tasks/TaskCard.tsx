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
        'group relative flex flex-col justify-between rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 dark:bg-zinc-900/60',
        isOverdue
          ? 'border-red-500/30 hover:border-red-500/50 dark:border-red-500/20'
          : 'border-slate-200/80 hover:border-indigo-400/50 dark:border-white/10 dark:hover:border-indigo-500/40 hover:shadow-glow'
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-slate-900 dark:text-zinc-100 line-clamp-2 text-xs leading-snug">
            {task.title}
          </h4>
          <div className="flex items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-200 transition-colors"
              title="Edit task"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="rounded-lg p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          {/* Due date info */}
          <div
            className={cn(
              'flex items-center gap-1.5 font-medium',
              isOverdue
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-zinc-400'
            )}
            title={isOverdue ? 'Task is overdue!' : `Due ${formatDate(task.dueDate)}`}
          >
            {isOverdue ? (
              <AlertCircle className="h-3 w-3 text-red-500" />
            ) : (
              <Calendar className="h-3 w-3 text-slate-400 dark:text-zinc-500" />
            )}
            <span>{formatDate(task.dueDate)}</span>
          </div>

          {/* Status badge pill */}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border',
              statusColors[task.status].badge
            )}
          >
            <span
              className={cn('h-1.5 w-1.5 rounded-full', statusColors[task.status].dot)}
            />
            {statusColors[task.status].label}
          </span>
        </div>

        {/* Quick status progression micro-buttons */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {task.status === 'todo' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 py-1 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
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
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={() => handleStatusChange('done')}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
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
              className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
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
