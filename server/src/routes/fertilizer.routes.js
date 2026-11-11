import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { fertilizerAdvisoryInputSchema } from '../schemas/fertilizer.schema.js';
import {
  recommendFertilizer,
  getFertilizerAdvisories,
  getFertilizerAdvisoryById,
  deleteFertilizerAdvisory,
} from '../controllers/fertilizer.controller.js';

const router = Router();

router.use(authenticate);

router.post('/recommend', validateBody(fertilizerAdvisoryInputSchema), recommendFertilizer);
router.get('/advisories', getFertilizerAdvisories);
router.get('/advisories/:id', getFertilizerAdvisoryById);
router.delete('/advisories/:id', deleteFertilizerAdvisory);

export default router;

