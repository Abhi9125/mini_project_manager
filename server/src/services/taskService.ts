import { taskRepository, TaskFilterOptions } from '../repositories/taskRepository.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { TaskStatus } from '../models/Task.js';
import { AppError } from '../utils/AppError.js';

export const taskService = {
  async getTasksByProject(projectId: string, userId: string, options: TaskFilterOptions) {
    // Verify project belongs to user
    const project = await projectRepository.findByIdAndUser(projectId, userId);
    if (!project) {
      throw new AppError('Project not found or unauthorized.', 404);
    }

    return taskRepository.findByProjectAndFilters(projectId, userId, options);
  },

  async createTask(
    projectId: string,
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      dueDate: string | Date;
    }
  ) {
    // Verify project belongs to user
    const project = await projectRepository.findByIdAndUser(projectId, userId);
    if (!project) {
      throw new AppError('Project not found or unauthorized.', 404);
    }

    return taskRepository.create({
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      dueDate: new Date(data.dueDate),
      projectId,
      userId,
    });
  },

  async getTaskById(id: string, userId: string) {
    const task = await taskRepository.findByIdAndUser(id, userId);
    if (!task) {
      throw new AppError('Task not found.', 404);
    }
    return task;
  },

  async updateTask(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      dueDate?: string | Date;
    }
  ) {
    const updatePayload: Record<string, any> = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.dueDate !== undefined) updatePayload.dueDate = new Date(data.dueDate);

    const updatedTask = await taskRepository.updateByIdAndUser(id, userId, updatePayload);
    if (!updatedTask) {
      throw new AppError('Task not found.', 404);
    }
    return updatedTask;
  },

  async deleteTask(id: string, userId: string) {
    const deletedTask = await taskRepository.deleteByIdAndUser(id, userId);
    if (!deletedTask) {
      throw new AppError('Task not found.', 404);
    }
    return { id, projectId: deletedTask.projectId };
  },
};
