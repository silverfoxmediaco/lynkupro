import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getNotifications = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

export const markAsRead = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Notification ${req.params.id} marked as read`
  });
});

export const markAllAsRead = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

export const deleteNotification = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Notification ${req.params.id} deleted`
  });
});

export const updateNotificationSettings = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Notification settings updated',
    data: req.body
  });
});