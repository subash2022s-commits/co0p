import { getSoilAnalysis } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';

export const analyzeSoil = async (req, res, next) => {
  try {
    const input = req.validatedBody;
    const analysis = await getSoilAnalysis(input);

    const savedRecord = await db.saveAdvisory('soil_reports', req.userSupabase, req.user.id, {
      farm_id: input.farmId || null,
      soil_data: input,
      analysis,
    });

    return res.status(200).json({
      success: true,
      message: 'Soil analysis completed successfully',
      data: savedRecord,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilReports = async (req, res, next) => {
  try {
    const reports = await db.listAdvisories('soil_reports', req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Soil reports retrieved successfully',
      data: reports,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await db.getAdvisoryById('soil_reports', req.userSupabase, req.user.id, id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Soil report not found',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Soil report retrieved',
      data: report,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSoilReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteAdvisory('soil_reports', req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Soil report not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Soil report deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

