import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { profileUpdateSchema } from '../schemas/profile.schema.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', validateBody(profileUpdateSchema), updateProfile);

export default router;

