import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, syncGoogleCalendar, syncOutlookCalendar } from '../controllers/calendarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

router.post('/sync/google', syncGoogleCalendar);
router.post('/sync/outlook', syncOutlookCalendar);

export default router;