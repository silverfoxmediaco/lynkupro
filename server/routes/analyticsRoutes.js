import express from 'express';
import { getDashboardStats, getLeadAnalytics, getProjectAnalytics, getRevenueAnalytics, getUserPerformance, generateReport } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/leads', getLeadAnalytics);
router.get('/projects', getProjectAnalytics);
router.get('/revenue', authorize('admin', 'manager'), getRevenueAnalytics);
router.get('/performance/:userId', authorize('admin', 'manager'), getUserPerformance);
router.post('/report', authorize('admin', 'manager'), generateReport);

export default router;