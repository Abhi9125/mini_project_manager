'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  useGetProjectByIdQuery,
  useGetTasksQuery,
  useDeleteTaskMutation,
  useDeleteProjectMutation,
} from '@/store/services/api';
import { Task, TaskStatus, Project } from '@/types';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskTable from '@/components/tasks/TaskTable';
import TaskFilters, { ViewMode } from '@/components/tasks/TaskFilters';
import TaskModal from '@/components/tasks/TaskModal';
import ProjectModal from '@/components/projects/ProjectModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  FolderKanban,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  // Filter, Sort & View states
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskModalDefaultStatus, setTaskModalDefaultStatus] = useState<TaskStatus>('todo');

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isDeletingProjectPrompt, setIsDeletingProjectPrompt] = useState(false);

  // Queries & Mutations
  const {
    data: projectResponse,
    isLoading: isLoadingProject,
    isError: isProjectError,
  } = useGetProjectByIdQuery(projectId, { skip: !projectId });

  const {
    data: tasksResponse,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useGetTasksQuery(
    {
      projectId,
      status: statusFilter,
      sortBy,
      order,
      search: searchQuery,
    },
    { skip: !projectId }
  );

  const [deleteTask, { isLoading: isDeletingTask }] = useDeleteTaskMutation();
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();

  const project = projectResponse?.data;
  const tasks = tasksResponse?.data || [];

  // Compute live task counts for the status tabs
  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  // Handlers for Task Modal
  const handleOpenAddTask = (defaultStatus: TaskStatus = 'todo') => {
    setEditingTask(null);
    setTaskModalDefaultStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTaskPrompt = (task: Task) => {
    setDeletingTask(task);
  };

  const handleConfirmDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask._id).unwrap();
      setDeletingTask(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleConfirmDeleteProject = async () => {
    if (!project) return;
    try {
      await deleteProject(project._id).unwrap();
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleSortChange = (newSortBy: string, newOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  if (isLoadingProject) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-2 text-sm text-gray-500">Loading project details...</p>
      </div>
    );
  }

  if (isProjectError || !project) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="text-base font-semibold text-red-800">Project Not Found</h3>
        <p className="mt-1 text-sm text-red-600">
          The requested project does not exist or you do not have permission to view it.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Project Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {project.title}
              </h1>
            </div>

            {project.description && (
              <p className="text-sm text-gray-600 max-w-3xl pt-1">
                {project.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </div>

          {/* Project Edit & Delete Actions */}
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={() => setIsEditingProject(true)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Project</span>
            </button>
            <button
              onClick={() => setIsDeletingProjectPrompt(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Filters, Search, Sort & View Switcher */}
      <TaskFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddTask={() => handleOpenAddTask('todo')}
        taskCounts={taskCounts}
      />

      {/* Dual Views: Kanban Board or Table */}
      {isLoadingTasks ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-2 text-sm text-gray-500">Loading tasks...</p>
        </div>
      ) : isTasksError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          Failed to load tasks. Please refresh the page.
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onAddTask={handleOpenAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTaskPrompt}
        />
      ) : (
        <TaskTable
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTaskPrompt}
        />
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        task={editingTask}
        defaultStatus={taskModalDefaultStatus}
      />

      {/* Task Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        isDestructive={true}
        isLoading={isDeletingTask}
      />

      {/* Project Edit Modal */}
      <ProjectModal
        isOpen={isEditingProject}
        onClose={() => setIsEditingProject(false)}
        project={project}
      />

      {/* Project Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeletingProjectPrompt}
        onClose={() => setIsDeletingProjectPrompt(false)}
        onConfirm={handleConfirmDeleteProject}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.title}"? This will permanently delete the project and all of its tasks.`}
        confirmText="Delete Project"
        isDestructive={true}
        isLoading={isDeletingProject}
      />
    </div>
  );
}
