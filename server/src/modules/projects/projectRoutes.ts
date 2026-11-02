import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from './projectController.js';
import taskRouter from '../tasks/taskRoutes.js';
import { protect } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validateMiddleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from './projectValidation.js';

const router = Router();

// Protect all project endpoints
router.use(protect);

// Nested tasks router: /api/projects/:projectId/tasks
router.use('/:projectId/tasks', taskRouter);

router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);
router.get('/:id', getProjectById);
router.put('/:id', validate(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

export default router;
