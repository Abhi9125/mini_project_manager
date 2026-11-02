import { z } from 'zod';

export const createTaskSchema = z.object({
  params: z.object({
    projectId: z.string({ required_error: 'Project ID is required' }),
  }),
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title cannot be empty')
      .max(150, 'Title cannot exceed 150 characters'),
    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional()
      .default(''),
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
    dueDate: z
      .string({ required_error: 'Due date is required' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format. Must be a valid ISO date string.',
      }),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Task ID is required' }),
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(150, 'Title cannot exceed 150 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters')
      .optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    dueDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format. Must be a valid ISO date string.',
      })
      .optional(),
  }),
});

export const queryTasksSchema = z.object({
  params: z.object({
    projectId: z.string({ required_error: 'Project ID is required' }),
  }),
  query: z.object({
    status: z.enum(['todo', 'in-progress', 'done', 'all']).optional(),
    sortBy: z.enum(['dueDate', 'createdAt', 'title']).optional().default('dueDate'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
    search: z.string().optional(),
  }),
});
