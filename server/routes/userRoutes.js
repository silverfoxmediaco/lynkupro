import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, updateUserRole } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin', 'user'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.put('/:id/role', authorize('admin'), updateUserRole);

export default router;