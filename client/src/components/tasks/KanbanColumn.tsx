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
        return <Circle className="h-4 w-4 text-amber-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'todo':
        return 'border-t-amber-500';
      case 'in-progress':
        return 'border-t-blue-500';
      case 'done':
        return 'border-t-emerald-500';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-gray-200 bg-gray-50/70 p-4 shadow-sm border-t-4',
        getBorderColor()
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-gray-600 shadow-sm border border-gray-200">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="rounded-lg p-1 text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all"
          title={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-xs text-gray-400">No tasks in {title.toLowerCase()}</p>
            <button
              onClick={() => onAddTask(status)}
              className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              + Add a task
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
