import express from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead, assignLead, updateLeadStatus } from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('admin', 'manager'), deleteLead);

router.put('/:id/assign', authorize('admin', 'manager'), assignLead);
router.put('/:id/status', updateLeadStatus);

export default router;