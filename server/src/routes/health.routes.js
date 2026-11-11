import { Router } from 'express';
import { isSupabaseConfigured } from '../config/supabase.js';
import { isGeminiConfigured, GEMINI_MODEL } from '../config/gemini.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgroAI Assistant API service is operational',
    data: {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        supabase: isSupabaseConfigured ? 'CONNECTED' : 'STANDBY_DEMO_MODE',
        gemini: isGeminiConfigured ? `CONFIGURED (${GEMINI_MODEL})` : 'STANDBY_FALLBACK_MODE',
      },
    },
    error: null,
  });
});

export default router;

