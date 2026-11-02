import mongoose from 'mongoose';
import { Project, IProject } from '../../models/Project.js';
import { Task } from '../../models/Task.js';

export interface ProjectWithStats extends IProject {
  taskStats: {
    total: number;
    done: number;
    inProgress: number;
    todo: number;
  };
}

export const projectRepository = {
  async findByUserId(userId: string): Promise<any[]> {
    return Project.find({ userId }).sort({ createdAt: -1 }).lean();
  },

  async findWithTaskStats(userId: string): Promise<any[]> {
    const projects = await Project.find({ userId }).sort({ createdAt: -1 }).lean();
    const projectIds = projects.map((p) => p._id);

    const taskCounts = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: '$projectId',
          total: { $sum: 1 },
          done: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
          },
          todo: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] },
          },
        },
      },
    ]);

    const countMap = new Map();
    taskCounts.forEach((c) => {
      countMap.set(c._id.toString(), {
        total: c.total,
        done: c.done,
        inProgress: c.inProgress,
        todo: c.todo,
      });
    });

    return projects.map((project) => ({
      ...project,
      taskStats: countMap.get(project._id.toString()) || {
        total: 0,
        done: 0,
        inProgress: 0,
        todo: 0,
      },
    }));
  },

  async findByIdAndUser(id: string, userId: string): Promise<IProject | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return Project.findOne({ _id: id, userId });
  },

  async create(projectData: { title: string; description: string; userId: string }): Promise<IProject> {
    return Project.create(projectData);
  },

  async updateByIdAndUser(
    id: string,
    userId: string,
    updateData: { title?: string; description?: string }
  ): Promise<IProject | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return Project.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  },

  async deleteByIdAndUser(id: string, userId: string): Promise<IProject | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return Project.findOneAndDelete({ _id: id, userId });
  },
};
