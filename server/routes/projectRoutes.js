import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject, addProjectMember, removeProjectMember, updateProjectStatus } from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('admin', 'manager'), createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('admin', 'manager'), updateProject)
  .delete(authorize('admin'), deleteProject);

router.post('/:id/members', authorize('admin', 'manager'), addProjectMember);
router.delete('/:id/members/:userId', authorize('admin', 'manager'), removeProjectMember);
router.put('/:id/status', authorize('admin', 'manager'), updateProjectStatus);

export default router;