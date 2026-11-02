'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Task, TaskStatus } from '@/types';
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/store/services/api';
import { Loader2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task?: Task | null;
  defaultStatus?: TaskStatus;
}

export default function TaskModal({
  isOpen,
  onClose,
  projectId,
  task,
  defaultStatus = 'todo',
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isEditing = Boolean(task);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
    setError(null);
  }, [task, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      const isoDueDate = new Date(dueDate + 'T12:00:00').toISOString();

      if (isEditing && task) {
        await updateTask({
          id: task._id,
          title: title.trim(),
          description: description.trim(),
          status,
          dueDate: isoDueDate,
        }).unwrap();
      } else {
        await createTask({
          projectId,
          title: title.trim(),
          description: description.trim(),
          status,
          dueDate: isoDueDate,
        }).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save task. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Add New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design user profile wireframe"
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 px-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Scope, links, or acceptance criteria..."
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 px-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:focus:border-indigo-400 transition-all cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 px-3.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 pt-2 border-t border-slate-200/70 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-glow hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
