import { getCultivationCalendar } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';

export const generateCalendar = async (req, res, next) => {
  try {
    const input = req.validatedBody;
    const generated = await getCultivationCalendar(input);

    const savedRecord = await db.saveAdvisory('cultivation_calendars', req.userSupabase, req.user.id, {
      farm_id: input.farmId || null,
      crop_name: input.cropName,
      start_date: input.startDate || new Date().toISOString().split('T')[0],
      activities: generated.activities,
    });

    return res.status(200).json({
      success: true,
      message: 'Cultivation calendar generated successfully',
      data: {
        ...savedRecord,
        estimatedDurationDays: generated.estimatedDurationDays,
        importantWarnings: generated.importantWarnings,
        dataLimitations: generated.dataLimitations,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getCalendars = async (req, res, next) => {
  try {
    const calendars = await db.listAdvisories('cultivation_calendars', req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Cultivation calendars retrieved successfully',
      data: calendars,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getCalendarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const calendar = await db.getAdvisoryById('cultivation_calendars', req.userSupabase, req.user.id, id);
    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Cultivation calendar not found',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cultivation calendar retrieved',
      data: calendar,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCalendarActivities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activities } = req.validatedBody;
    const updated = await db.updateCalendarActivity(req.userSupabase, req.user.id, id, activities);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Cultivation calendar not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cultivation activities updated successfully',
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCalendar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteAdvisory('cultivation_calendars', req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Calendar not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cultivation calendar deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

