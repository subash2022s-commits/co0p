import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  analyzeDisease,
  getDiseaseReports,
  getDiseaseReportById,
  deleteDiseaseReport,
} from '../controllers/disease.controller.js';

const router = Router();

router.use(authenticate);

// Multipart/form-data upload or JSON
router.post('/analyze', upload.single('image'), analyzeDisease);
router.get('/reports', getDiseaseReports);
router.get('/reports/:id', getDiseaseReportById);
router.delete('/reports/:id', deleteDiseaseReport);

export default router;

