'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowRight,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const stats = project.taskStats || { total: 0, done: 0, inProgress: 0, todo: 0 };
  const percentComplete = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Edit project"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {project.description || 'No description provided.'}
        </p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Progress</span>
            <span className="font-medium text-gray-700">{percentComplete}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Task Counts */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Circle className="h-3 w-3 text-amber-500" />
              <span>To Do</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-800">{stats.todo}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>Active</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-800">{stats.inProgress}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>Done</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-800">{stats.done}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
        <span>Created {formatDate(project.createdAt)}</span>
        <Link
          href={`/projects/${project._id}`}
          className="flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 group/link"
        >
          <span>View Tasks</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
