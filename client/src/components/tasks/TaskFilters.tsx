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
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50 mb-6">
      {/* Top Row: Search, Sort, View Toggle, Add Task */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Controls: Sort, View Toggle, Add Task */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-300">
            <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-zinc-500" />
            <select
              value={currentSortKey}
              onChange={(e) => handleSortSelect(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="dueDate:asc" className="dark:bg-zinc-900">Due: Soonest</option>
              <option value="dueDate:desc" className="dark:bg-zinc-900">Due: Latest</option>
              <option value="createdAt:desc" className="dark:bg-zinc-900">Created: Newest</option>
              <option value="title:asc" className="dark:bg-zinc-900">Title: A to Z</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-100/70 p-0.5 dark:border-white/10 dark:bg-zinc-800/60">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              )}
              title="Board View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
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
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-3 dark:border-white/5">
        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mr-1">Filter:</span>
        <button
          onClick={() => onStatusChange('all')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
            statusFilter === 'all'
              ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5'
          )}
        >
          <span>All Tasks</span>
          <span className="rounded-full bg-slate-200/80 px-1.5 py-0.2 text-[10px] text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold">
            {taskCounts.all}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('todo')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
            statusFilter === 'todo'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5'
          )}
        >
          <Circle className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          <span>To Do</span>
          <span className="rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[10px] text-amber-700 dark:text-amber-300 font-bold">
            {taskCounts.todo}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('in-progress')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
            statusFilter === 'in-progress'
              ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5'
          )}
        >
          <Clock className="h-2.5 w-2.5 text-indigo-500" />
          <span>In Progress</span>
          <span className="rounded-full bg-indigo-500/10 px-1.5 py-0.2 text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">
            {taskCounts.inProgress}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('done')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
            statusFilter === 'done'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20'
              : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5'
          )}
        >
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
          <span>Done</span>
          <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
            {taskCounts.done}
          </span>
        </button>
      </div>
    </div>
  );
}
