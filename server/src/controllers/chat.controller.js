import { getChatResponse } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';

export const listConversations = async (req, res, next) => {
  try {
    const convs = await db.listChatConversations(req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Conversations retrieved successfully',
      data: convs,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { title, language } = req.validatedBody;
    const conversation = await db.createChatConversation(req.userSupabase, req.user.id, title, language);
    return res.status(201).json({
      success: true,
      message: 'Chat conversation created',
      data: conversation,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await db.getChatMessages(req.userSupabase, req.user.id, id);
    return res.status(200).json({
      success: true,
      message: 'Chat messages retrieved',
      data: messages,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const sendChatMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, language } = req.validatedBody;

    // 1. Save user message
    const userMsgRecord = await db.addChatMessage(req.userSupabase, req.user.id, id, 'user', message);

    // 2. Fetch conversation history
    const history = await db.getChatMessages(req.userSupabase, req.user.id, id);

    // 3. Generate response using Gemini
    const aiResponse = await getChatResponse(history.slice(-8), message, language || 'en');

    // 4. Save assistant message
    const assistantMsgRecord = await db.addChatMessage(
      req.userSupabase,
      req.user.id,
      id,
      'assistant',
      aiResponse.answer
    );

    return res.status(200).json({
      success: true,
      message: 'Message processed successfully',
      data: {
        userMessage: userMsgRecord,
        assistantMessage: assistantMsgRecord,
        metadata: {
          relatedTopics: aiResponse.relatedTopics,
          warnings: aiResponse.warnings,
          requiresExpertConsultation: aiResponse.requiresExpertConsultation,
        },
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteChatConversation(req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Conversation does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

