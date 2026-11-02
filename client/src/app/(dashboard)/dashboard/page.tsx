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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.name || 'Developer'}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is an overview of your active projects and task completion.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 self-start sm:self-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pending (To Do)</p>
              <p className="text-2xl font-bold text-gray-900">{totalTodo}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{totalInProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalDone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Projects ({filteredProjects.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-2 text-sm text-gray-500">Loading your projects...</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            Failed to load projects. Ensure the backend server is running.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <FolderPlus className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">
              {searchQuery ? 'No matching projects found' : 'No projects yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {searchQuery
                ? 'Try searching with a different keyword.'
                : 'Get started by creating your first project to manage tasks and track progress.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
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
