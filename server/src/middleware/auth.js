import { isSupabaseConfigured, supabasePublic, getUserScopedSupabase } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format',
        data: null,
        error: { code: 'UNAUTHORIZED', details: ['Bearer token required'] },
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Empty authorization token',
        data: null,
        error: { code: 'UNAUTHORIZED', details: ['Token is empty'] },
      });
    }

    // If Supabase is fully configured, verify with Supabase Auth
    if (isSupabaseConfigured && supabasePublic) {
      const { data, error } = await supabasePublic.auth.getUser(token);
      if (error || !data?.user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired authentication session',
          data: null,
          error: { code: 'SESSION_EXPIRED', details: [error?.message || 'User not found'] },
        });
      }

      req.user = data.user;
      req.accessToken = token;
      req.userSupabase = getUserScopedSupabase(token);
      return next();
    }

    // Development / Demo Fallback Mode (when Supabase credentials have not yet been provided in .env)
    // Decodes demo token or assigns demo farmer identity
    let demoUserId = '00000000-0000-0000-0000-000000000001';
    let demoEmail = 'farmer@agroai.local';
    try {
      if (token.includes('.')) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        if (payload.sub) demoUserId = payload.sub;
        if (payload.email) demoEmail = payload.email;
      }
    } catch {
      // Use standard fallback demo user
    }

    req.user = {
      id: demoUserId,
      email: demoEmail,
      user_metadata: { full_name: 'Demo Farmer', preferred_language: 'en' },
    };
    req.accessToken = token;
    req.userSupabase = null;
    return next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error',
      data: null,
      error: { code: 'AUTH_ERROR', details: [err.message] },
    });
  }
};

