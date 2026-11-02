import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isPast, isToday, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (err) {
    return dateString;
  }
}

export function isTaskOverdue(dateString: string, status: string): boolean {
  if (status === 'done') return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}

export const statusColors = {
  todo: {
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    label: 'To Do',
  },
  'in-progress': {
    badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    label: 'In Progress',
  },
  done: {
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    label: 'Done',
  },
};
