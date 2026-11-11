import { getFertilizerAdvisory } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';

export const recommendFertilizer = async (req, res, next) => {
  try {
    const input = req.validatedBody;
    const advisory = await getFertilizerAdvisory(input);

    const savedRecord = await db.saveAdvisory('fertilizer_advisories', req.userSupabase, req.user.id, {
      farm_id: input.farmId || null,
      crop_name: input.cropName,
      input_data: input,
      advisory,
    });

    return res.status(200).json({
      success: true,
      message: 'Fertilizer advisory generated successfully',
      data: savedRecord,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getFertilizerAdvisories = async (req, res, next) => {
  try {
    const advisories = await db.listAdvisories('fertilizer_advisories', req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Fertilizer advisories retrieved successfully',
      data: advisories,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getFertilizerAdvisoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const advisory = await db.getAdvisoryById('fertilizer_advisories', req.userSupabase, req.user.id, id);
    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Fertilizer advisory not found',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Fertilizer advisory retrieved',
      data: advisory,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFertilizerAdvisory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteAdvisory('fertilizer_advisories', req.userSupabase, req.user.id, id);
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
      message: 'Fertilizer advisory deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

