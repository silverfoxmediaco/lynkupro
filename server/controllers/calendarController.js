import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getEvents = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

export const getEvent = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.params.id,
      title: 'Sample Event'
    }
  });
});

export const createEvent = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    data: req.body
  });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.params.id,
      ...req.body
    }
  });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
});

export const syncGoogleCalendar = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Google Calendar sync - To be implemented'
  });
});

export const syncOutlookCalendar = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Outlook Calendar sync - To be implemented'
  });
});