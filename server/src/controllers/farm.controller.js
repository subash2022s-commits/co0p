import { db } from '../services/db.service.js';

export const getFarms = async (req, res, next) => {
  try {
    const farms = await db.listFarms(req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Farms retrieved successfully',
      data: farms,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const createFarm = async (req, res, next) => {
  try {
    const farm = await db.createFarm(req.userSupabase, req.user.id, req.validatedBody);
    return res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: farm,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteFarm(req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Farm does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Farm deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

