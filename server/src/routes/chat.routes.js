import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createConversationSchema, sendMessageSchema } from '../schemas/chat.schema.js';
import {
  listConversations,
  createConversation,
  getConversationMessages,
  sendChatMessage,
  deleteConversation,
} from '../controllers/chat.controller.js';

const router = Router();

router.use(authenticate);

router.get('/conversations', listConversations);
router.post('/conversations', validateBody(createConversationSchema), createConversation);
router.get('/conversations/:id', getConversationMessages);
router.post('/conversations/:id/messages', validateBody(sendMessageSchema), sendChatMessage);
router.delete('/conversations/:id', deleteConversation);

export default router;

