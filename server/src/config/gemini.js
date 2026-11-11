import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY &&
  GEMINI_API_KEY !== 'your-gemini-api-key' &&
  GEMINI_API_KEY.trim().length > 0
);

export const ai = isGeminiConfigured
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  : null;

