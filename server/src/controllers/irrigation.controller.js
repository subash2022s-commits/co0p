import { getIrrigationAdvisory } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';

export const recommendIrrigation = async (req, res, next) => {
  try {
    const input = req.validatedBody;
    const advisory = await getIrrigationAdvisory(input);

    const savedRecord = await db.saveAdvisory('irrigation_advisories', req.userSupabase, req.user.id, {
      farm_id: input.farmId || null,
      crop_name: input.cropName,
      input_data: input,
      advisory,
    });

    return res.status(200).json({
      success: true,
      message: 'Irrigation advisory generated successfully',
      data: savedRecord,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getIrrigationAdvisories = async (req, res, next) => {
  try {
    const advisories = await db.listAdvisories('irrigation_advisories', req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Irrigation advisories retrieved successfully',
      data: advisories,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getIrrigationAdvisoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const advisory = await db.getAdvisoryById('irrigation_advisories', req.userSupabase, req.user.id, id);
    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Irrigation advisory not found',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Irrigation advisory retrieved',
      data: advisory,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIrrigationAdvisory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteAdvisory('irrigation_advisories', req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Irrigation advisory deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

