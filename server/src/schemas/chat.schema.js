import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().max(150).optional().default('New Agricultural Query'),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
  language: z.string().default('en'),
});

export const chatbotResponseSchema = z.object({
  answer: z.string().min(1),
  language: z.string().default('en'),
  relatedTopics: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  requiresExpertConsultation: z.boolean().default(false),
});

