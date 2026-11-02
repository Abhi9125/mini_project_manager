import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Task, TaskStatus } from '../models/Task.js';

export const getTasksByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const { status, sortBy = 'dueDate', order = 'asc', search } = req.query as {
      status?: string;
      sortBy?: 'dueDate' | 'createdAt' | 'title';
      order?: 'asc' | 'desc';
      search?: string;
    };

    if (!mongoose.isValidObjectId(projectId)) {
      res.status(400).json({ success: false, message: 'Invalid project ID format' });
      return;
    }

    // Verify user owns the project
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    // Build filter query
    const filter: Record<string, any> = { projectId, userId };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortField = sortBy || 'dueDate';

    const tasks = await Task.find(filter)
      .sort({ [sortField]: sortOrder })
      .lean();

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, description, status, dueDate } = req.body;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(projectId)) {
      res.status(400).json({ success: false, message: 'Invalid project ID format' });
      return;
    }

    // Verify user owns the project
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
      return;
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      dueDate: new Date(dueDate),
      projectId,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status as TaskStatus;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id, projectId: task.projectId },
    });
  } catch (error) {
    next(error);
  }
};
