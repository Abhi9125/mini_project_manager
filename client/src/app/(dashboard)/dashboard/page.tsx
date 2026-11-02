'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from '@/store/services/api';
import { Project } from '@/types';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectModal from '@/components/projects/ProjectModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import {
  FolderPlus,
  Search,
  FolderKanban,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, isError } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const projects = response?.data || [];

  const filteredProjects = projects.filter((project) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      project.title.toLowerCase().includes(q) ||
      (project.description && project.description.toLowerCase().includes(q))
    );
  });

  // Calculate overview metrics across all projects
  const totalProjects = projects.length;
  let totalTasks = 0;
  let totalDone = 0;
  let totalInProgress = 0;
  let totalTodo = 0;

  projects.forEach((p) => {
    if (p.taskStats) {
      totalTasks += p.taskStats.total;
      totalDone += p.taskStats.done;
      totalInProgress += p.taskStats.inProgress;
      totalTodo += p.taskStats.todo;
    }
  });

  const overallCompletion = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (project: Project) => {
    setDeletingProject(project);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await deleteProject(deletingProject._id).unwrap();
      setDeletingProject(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Developer'}
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Monitor real-time project progress and sprint task completion.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Aceternity Bento Grid Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Projects */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Total Projects</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalProjects}</span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">workspaces</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active tracking</span>
          </div>
        </div>

        {/* Card 2: To Do */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">To Do</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ListTodo className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalTodo}</span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">pending tasks</span>
          </div>
          <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Ready for execution
          </p>
        </div>

        {/* Card 3: In Progress */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">In Progress</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalInProgress}</span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">underway</span>
          </div>
          <p className="mt-3 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Active sprints
          </p>
        </div>

        {/* Card 4: Completed Tasks & Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Done</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalDone}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ({overallCompletion}% rate)
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Projects Section Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Projects
            </h2>
            <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
              {filteredProjects.length}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter projects..."
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-900/60 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
            <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500">Loading workspaces...</p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-xs text-red-600 dark:text-red-400">
            Failed to load projects. Ensure the backend server is running.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/50 p-12 text-center dark:border-white/10 dark:bg-zinc-900/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-glow">
              <FolderPlus className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'No matching projects' : 'No projects created yet'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
              {searchQuery
                ? 'Try searching with a different keyword or clear your filter.'
                : 'Create your first project workspace to start tracking tasks and kanban workflows.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all"
              >
                <FolderPlus className="h-4 w-4" />
                <span>Create First Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deletingProject?.title}"? This action cannot be undone and will permanently remove all tasks associated with this project.`}
        confirmText="Delete Project"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
