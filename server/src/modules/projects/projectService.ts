import { projectRepository } from './projectRepository.js';
import { taskRepository } from '../tasks/taskRepository.js';
import { AppError } from '../../utils/AppError.js';

export const projectService = {
  async getProjects(userId: string) {
    return projectRepository.findWithTaskStats(userId);
  },

  async getProjectById(id: string, userId: string) {
    const project = await projectRepository.findByIdAndUser(id, userId);
    if (!project) {
      throw new AppError('Project not found.', 404);
    }
    return project;
  },

  async createProject(userId: string, data: { title: string; description?: string }) {
    return projectRepository.create({
      title: data.title,
      description: data.description || '',
      userId,
    });
  },

  async updateProject(id: string, userId: string, data: { title?: string; description?: string }) {
    const updatedProject = await projectRepository.updateByIdAndUser(id, userId, data);
    if (!updatedProject) {
      throw new AppError('Project not found.', 404);
    }
    return updatedProject;
  },

  async deleteProject(id: string, userId: string) {
    const deletedProject = await projectRepository.deleteByIdAndUser(id, userId);
    if (!deletedProject) {
      throw new AppError('Project not found.', 404);
    }

    // Cascade delete associated tasks
    await taskRepository.deleteManyByProjectId(id);

    return { id };
  },
};
