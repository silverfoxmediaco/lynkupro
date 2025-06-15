import express from 'express';
import { getVendors, getVendor, createVendor, updateVendor, deleteVendor, rateVendor } from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getVendors)
  .post(authorize('admin', 'manager'), createVendor);

router.route('/:id')
  .get(getVendor)
  .put(authorize('admin', 'manager'), updateVendor)
  .delete(authorize('admin'), deleteVendor);

router.post('/:id/rate', rateVendor);

export default router;