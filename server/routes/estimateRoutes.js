import express from 'express';
import { getEstimates, getEstimate, createEstimate, updateEstimate, deleteEstimate, sendEstimate, convertToProject } from '../controllers/estimateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEstimates)
  .post(createEstimate);

router.route('/:id')
  .get(getEstimate)
  .put(updateEstimate)
  .delete(authorize('admin', 'manager'), deleteEstimate);

router.post('/:id/send', sendEstimate);
router.post('/:id/convert', authorize('admin', 'manager'), convertToProject);

export default router;