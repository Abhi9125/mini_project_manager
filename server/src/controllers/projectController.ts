import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const projects = await Project.find({ userId }).sort({ createdAt: -1 }).lean();

    // Fetch task counts per project for dashboard summary
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

    const enrichedProjects = projects.map((project) => ({
      ...project,
      taskStats: countMap.get(project._id.toString()) || {
        total: 0,
        done: 0,
        inProgress: 0,
        todo: 0,
      },
    }));

    res.status(200).json({
      success: true,
      data: enrichedProjects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid project ID format' });
      return;
    }

    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    const project = await Project.create({
      title,
      description: description || '',
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid project ID format' });
      return;
    }

    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid project ID format' });
      return;
    }

    const project = await Project.findOneAndDelete({ _id: id, userId });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Cascade delete all tasks belonging to this project
    await Task.deleteMany({ projectId: id });

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
