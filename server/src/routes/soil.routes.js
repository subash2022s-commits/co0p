import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { soilAnalysisInputSchema } from '../schemas/soil.schema.js';
import {
  analyzeSoil,
  getSoilReports,
  getSoilReportById,
  deleteSoilReport,
} from '../controllers/soil.controller.js';

const router = Router();

router.use(authenticate);

router.post('/analyze', validateBody(soilAnalysisInputSchema), analyzeSoil);
router.get('/reports', getSoilReports);
router.get('/reports/:id', getSoilReportById);
router.delete('/reports/:id', deleteSoilReport);

export default router;

