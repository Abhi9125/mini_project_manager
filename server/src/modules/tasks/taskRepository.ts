import mongoose from 'mongoose';
import { Task, ITask, TaskStatus } from '../../models/Task.js';

export interface TaskFilterOptions {
  status?: string;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'title';
  order?: 'asc' | 'desc';
}

export const taskRepository = {
  async findByProjectAndFilters(
    projectId: string,
    userId: string,
    options: TaskFilterOptions
  ): Promise<any[]> {
    if (!mongoose.isValidObjectId(projectId)) return [];

    const filter: Record<string, any> = { projectId, userId };

    if (options.status && options.status !== 'all') {
      filter.status = options.status;
    }

    if (options.search && options.search.trim() !== '') {
      filter.$or = [
        { title: { $regex: options.search.trim(), $options: 'i' } },
        { description: { $regex: options.search.trim(), $options: 'i' } },
      ];
    }

    const sortOrder = options.order === 'desc' ? -1 : 1;
    const sortField = options.sortBy || 'dueDate';

    return Task.find(filter)
      .sort({ [sortField]: sortOrder })
      .lean();
  },

  async findByIdAndUser(id: string, userId: string): Promise<ITask | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findOne({ _id: id, userId });
  },

  async create(taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: Date;
    projectId: string;
    userId: string;
  }): Promise<ITask> {
    return Task.create(taskData);
  },

  async updateByIdAndUser(
    id: string,
    userId: string,
    updateData: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      dueDate?: Date;
    }
  ): Promise<ITask | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  },

  async deleteByIdAndUser(id: string, userId: string): Promise<ITask | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return Task.findOneAndDelete({ _id: id, userId });
  },

  async deleteManyByProjectId(projectId: string): Promise<number> {
    if (!mongoose.isValidObjectId(projectId)) return 0;
    const result = await Task.deleteMany({ projectId });
    return result.deletedCount;
  },
};
