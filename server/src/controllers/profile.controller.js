import { db } from '../services/db.service.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await db.getProfile(req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile || {
        id: req.user.id,
        full_name: req.user.user_metadata?.full_name || 'Farmer',
        preferred_language: req.user.user_metadata?.preferred_language || 'en',
        country: 'India',
        farming_experience: 0,
        land_area: 0,
        land_unit: 'acre',
        irrigation_available: false,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await db.upsertProfile(req.userSupabase, req.user.id, req.validatedBody);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

