import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { farmCreateSchema } from '../schemas/farm.schema.js';
import { getFarms, createFarm, deleteFarm } from '../controllers/farm.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getFarms);
router.post('/', validateBody(farmCreateSchema), createFarm);
router.delete('/:id', deleteFarm);

export default router;

