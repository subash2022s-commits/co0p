import { getCropRecommendation } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';
import { GEMINI_MODEL } from '../config/gemini.js';

export const recommendCrops = async (req, res, next) => {
  try {
    const input = req.validatedBody;
    const recommendations = await getCropRecommendation(input);

    const savedRecord = await db.saveAdvisory('crop_recommendations', req.userSupabase, req.user.id, {
      farm_id: input.farmId || null,
      input_data: input,
      recommendations,
      advisory_language: input.language || 'en',
      model_name: GEMINI_MODEL,
    });

    return res.status(200).json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: savedRecord,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getCropRecommendations = async (req, res, next) => {
  try {
    const records = await db.listAdvisories('crop_recommendations', req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Crop recommendations retrieved successfully',
      data: records,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getCropRecommendationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await db.getAdvisoryById('crop_recommendations', req.userSupabase, req.user.id, id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Crop recommendation retrieved',
      data: record,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCropRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteAdvisory('crop_recommendations', req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Crop recommendation deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

