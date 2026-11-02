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
} from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export default function TaskTable({
  tasks,
  onEditTask,
  onDeleteTask,
}: TaskTableProps) {
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask({
        id: taskId,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-8 text-center dark:border-white/10 dark:bg-zinc-900/30">
        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">No tasks matching your filter</p>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">Try adjusting your search keyword or status pill</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/70 dark:divide-white/5">
          <thead className="bg-slate-50/70 dark:bg-zinc-800/40 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Task Title & Description
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 text-xs">
            {tasks.map((task) => {
              const isOverdue = isTaskOverdue(task.dueDate, task.status);

              return (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-zinc-100">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 max-w-md leading-relaxed">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value as TaskStatus)
                      }
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-900',
                        statusColors[task.status].badge
                      )}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium',
                        isOverdue
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-600 dark:text-zinc-400'
                      )}
                    >
                      {isOverdue ? (
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      ) : (
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                      )}
                      <span>{formatDate(task.dueDate)}</span>
                      {isOverdue && (
                        <span className="ml-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400 border border-red-500/20">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditTask(task)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-200 transition-colors"
                        title="Edit task"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
