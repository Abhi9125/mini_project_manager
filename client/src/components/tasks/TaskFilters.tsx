'use client';

import React from 'react';
import { TaskStatus } from '@/types';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  ArrowUpDown,
  Circle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'kanban' | 'table';

interface TaskFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  order: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddTask: () => void;
  taskCounts: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

export default function TaskFilters({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortBy,
  order,
  onSortChange,
  viewMode,
  onViewModeChange,
  onAddTask,
  taskCounts,
}: TaskFiltersProps) {
  const currentSortKey = `${sortBy}:${order}`;

  const handleSortSelect = (val: string) => {
    const [newSortBy, newOrder] = val.split(':') as [string, 'asc' | 'desc'];
    onSortChange(newSortBy, newOrder);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-6">
      {/* Top Row: Search, Sort, View Toggle, Add Task */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Controls: Sort, View Toggle, Add Task */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={currentSortKey}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="dueDate:asc">Due Date: Soonest</option>
              <option value="dueDate:desc">Due Date: Latest</option>
              <option value="createdAt:desc">Newest Created</option>
              <option value="title:asc">Title: A to Z</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={cn(
                'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              title="Kanban Board View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={cn(
                'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Add Task CTA */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs (especially useful for Table view or quick filtering) */}
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        <span className="text-xs font-medium text-gray-500 mr-1">Filter by Status:</span>
        <button
          onClick={() => onStatusChange('all')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all',
            statusFilter === 'all'
              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <span>All Tasks</span>
          <span className="rounded-full bg-gray-200/80 px-1.5 py-0.2 text-[10px] text-gray-700">
            {taskCounts.all}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('todo')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all',
            statusFilter === 'todo'
              ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <Circle className="h-3 w-3 text-amber-500" />
          <span>To Do</span>
          <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] text-amber-800">
            {taskCounts.todo}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('in-progress')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all',
            statusFilter === 'in-progress'
              ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <Clock className="h-3 w-3 text-blue-500" />
          <span>In Progress</span>
          <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] text-blue-800">
            {taskCounts.inProgress}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('done')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all',
            statusFilter === 'done'
              ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          <span>Done</span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800">
            {taskCounts.done}
          </span>
        </button>
      </div>
    </div>
  );
}
