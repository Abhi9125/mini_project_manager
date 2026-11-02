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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-glow dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-indigo-500/40">
      <div>
        {/* Card Header: Icon, Title & Edit/Delete Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Created {formatDate(project.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-200 transition-colors"
              title="Edit project"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
              title="Delete project"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 min-h-[2rem] leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Gradient Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-slate-800 dark:text-zinc-200">{percentComplete}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Bento Task Stat Pills */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-white/5 pt-3">
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              <Circle className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span>To Do</span>
            </div>
            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-zinc-200">{stats.todo}</p>
          </div>
          <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
              <Clock className="h-2.5 w-2.5 text-indigo-500" />
              <span>Active</span>
            </div>
            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-zinc-200">{stats.inProgress}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
              <span>Done</span>
            </div>
            <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-zinc-200">{stats.done}</p>
          </div>
        </div>
      </div>

      {/* Card Footer: View Tasks CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3">
        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
          {stats.total} total {stats.total === 1 ? 'task' : 'tasks'}
        </span>
        <Link
          href={`/projects/${project._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group/link"
        >
          <span>Open Board</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
