import { Router } from 'express';
import {
  getTasksByProject,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from './taskController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  queryTasksSchema,
} from './taskValidation.js';

const router = Router({ mergeParams: true });

// Protect all task endpoints
router.use(protect);

// Nested project routes: /api/projects/:projectId/tasks
router.get('/', validate(queryTasksSchema), getTasksByProject);
router.post('/', validate(createTaskSchema), createTask);

// Standalone direct task routes: /api/tasks/:id
export const standaloneTaskRouter = Router();
standaloneTaskRouter.use(protect);
standaloneTaskRouter.get('/:id', getTaskById);
standaloneTaskRouter.put('/:id', validate(updateTaskSchema), updateTask);
standaloneTaskRouter.delete('/:id', deleteTask);

export default router;
