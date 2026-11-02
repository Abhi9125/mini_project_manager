export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ProjectStats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  taskStats?: ProjectStats;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

export interface AuthResponseData {
  user: User;
  token: string;
}
