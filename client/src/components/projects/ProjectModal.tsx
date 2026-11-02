'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Project } from '@/types';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/store/services/api';
import { Loader2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isEditing = Boolean(project);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setError(null);
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      if (isEditing && project) {
        await updateProject({
          id: project._id,
          title: title.trim(),
          description: description.trim(),
        }).unwrap();
      } else {
        await createProject({
          title: title.trim(),
          description: description.trim(),
        }).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save project. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next-Gen Mobile App"
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
            placeholder="Key objectives, goals, and team notes..."
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 px-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 resize-none transition-all"
          />
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
            {isEditing ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
