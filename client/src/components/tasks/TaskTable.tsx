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
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500">No tasks found matching your filter</p>
        <p className="mt-1 text-xs text-gray-400">Try adjusting your search or status filter</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
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
          <tbody className="divide-y divide-gray-100 text-sm">
            {tasks.map((task) => {
              const isOverdue = isTaskOverdue(task.dueDate, task.status);

              return (
                <tr key={task._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    {task.description && (
                      <div className="mt-0.5 text-xs text-gray-500 line-clamp-1 max-w-md">
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
                        'rounded-full px-2.5 py-1 text-xs font-medium border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500',
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
                        isOverdue ? 'text-red-600' : 'text-gray-600'
                      )}
                    >
                      {isOverdue ? (
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      ) : (
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span>{formatDate(task.dueDate)}</span>
                      {isOverdue && (
                        <span className="ml-1 rounded bg-red-100 px-1.5 py-0.2 text-[10px] text-red-700">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditTask(task)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="Edit task"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
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
