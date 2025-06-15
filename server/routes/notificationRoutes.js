import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, updateNotificationSettings } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.put('/settings', updateNotificationSettings);

export default router;