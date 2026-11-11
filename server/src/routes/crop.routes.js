import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { cropRecommendationInputSchema } from '../schemas/crop.schema.js';
import {
  recommendCrops,
  getCropRecommendations,
  getCropRecommendationById,
  deleteCropRecommendation,
} from '../controllers/crop.controller.js';

const router = Router();

router.use(authenticate);

router.post('/recommend', validateBody(cropRecommendationInputSchema), recommendCrops);
router.get('/recommendations', getCropRecommendations);
router.get('/recommendations/:id', getCropRecommendationById);
router.delete('/recommendations/:id', deleteCropRecommendation);

export default router;

