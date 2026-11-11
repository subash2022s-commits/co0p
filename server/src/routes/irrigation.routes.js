import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { irrigationAdvisoryInputSchema } from '../schemas/irrigation.schema.js';
import {
  recommendIrrigation,
  getIrrigationAdvisories,
  getIrrigationAdvisoryById,
  deleteIrrigationAdvisory,
} from '../controllers/irrigation.controller.js';

const router = Router();

router.use(authenticate);

router.post('/recommend', validateBody(irrigationAdvisoryInputSchema), recommendIrrigation);
router.get('/advisories', getIrrigationAdvisories);
router.get('/advisories/:id', getIrrigationAdvisoryById);
router.delete('/advisories/:id', deleteIrrigationAdvisory);

export default router;

