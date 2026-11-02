import { Request, Response, NextFunction } from 'express';
import { taskService } from './taskService.js';
import { TaskStatus } from '../../models/Task.js';

export const getTasksByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const { status, sortBy, order, search } = req.query as {
      status?: string;
      sortBy?: 'dueDate' | 'createdAt' | 'title';
      order?: 'asc' | 'desc';
      search?: string;
    };

    const tasks = await taskService.getTasksByProject(projectId, userId, {
      status,
      sortBy,
      order,
      search,
    });

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
    const userId = req.user!.id;
    const { title, description, status, dueDate } = req.body;

    const task = await taskService.createTask(projectId, userId, {
      title,
      description,
      status: status as TaskStatus,
      dueDate,
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
    const userId = req.user!.id;

    const task = await taskService.getTaskById(id, userId);

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
    const userId = req.user!.id;
    const { title, description, status, dueDate } = req.body;

    const task = await taskService.updateTask(id, userId, {
      title,
      description,
      status: status as TaskStatus,
      dueDate,
    });

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
    const userId = req.user!.id;

    const result = await taskService.deleteTask(id, userId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
