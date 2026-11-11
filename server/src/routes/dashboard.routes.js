import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getDashboardSummary,
  getRecentActivities,
  getUpcomingTasks,
} from '../controllers/dashboard.controller.js';

const router = Router();

router.use(authenticate);

router.get('/summary', getDashboardSummary);
router.get('/recent-activities', getRecentActivities);
router.get('/upcoming-tasks', getUpcomingTasks);

export default router;

