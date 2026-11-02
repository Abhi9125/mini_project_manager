'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const getIcon = () => {
    switch (status) {
      case 'todo':
        return <Circle className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />;
      case 'in-progress':
        return <Clock className="h-3.5 w-3.5 text-indigo-500" />;
      case 'done':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  const getBorderTopColor = () => {
    switch (status) {
      case 'todo':
        return 'border-t-amber-500';
      case 'in-progress':
        return 'border-t-indigo-500';
      case 'done':
        return 'border-t-emerald-500';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/60 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/40 border-t-2 transition-colors',
        getBorderTopColor()
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-xs font-bold tracking-tight text-slate-900 dark:text-zinc-200 uppercase">
            {title}
          </h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-slate-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200/80 dark:border-white/10">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-800 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-200 transition-all shadow-sm"
          title={`Add task to ${title}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Task List Container */}
      <div className="flex flex-col gap-2.5 min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-white/5">
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">No tasks in {title.toLowerCase()}</p>
            <button
              onClick={() => onAddTask(status)}
              className="mt-2 text-[11px] font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              + Create task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
