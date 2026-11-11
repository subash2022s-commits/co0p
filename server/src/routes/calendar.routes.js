import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  calendarGenerateInputSchema,
  calendarActivityUpdateSchema,
} from '../schemas/calendar.schema.js';
import {
  generateCalendar,
  getCalendars,
  getCalendarById,
  updateCalendarActivities,
  deleteCalendar,
} from '../controllers/calendar.controller.js';

const router = Router();

router.use(authenticate);

router.post('/generate', validateBody(calendarGenerateInputSchema), generateCalendar);
router.get('/', getCalendars);
router.get('/:id', getCalendarById);
router.put('/:id', validateBody(calendarActivityUpdateSchema), updateCalendarActivities);
router.delete('/:id', deleteCalendar);

export default router;

