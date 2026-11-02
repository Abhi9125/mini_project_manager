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
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    label: 'To Do',
  },
  'in-progress': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    label: 'In Progress',
  },
  done: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Done',
  },
};
