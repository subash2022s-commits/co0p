import { db } from '../services/db.service.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const client = req.userSupabase;

    const [crops, soil, fertilizers, irrigations, diseases, calendars, farms, profile] = await Promise.all([
      db.listAdvisories('crop_recommendations', client, userId),
      db.listAdvisories('soil_reports', client, userId),
      db.listAdvisories('fertilizer_advisories', client, userId),
      db.listAdvisories('irrigation_advisories', client, userId),
      db.listAdvisories('disease_reports', client, userId),
      db.listAdvisories('cultivation_calendars', client, userId),
      db.listFarms(client, userId),
      db.getProfile(client, userId),
    ]);

    const totalAdvisories = crops.length + soil.length + fertilizers.length + irrigations.length + diseases.length;

    // Calculate profile completion percentage
    let profileScore = 0;
    if (profile?.full_name) profileScore += 25;
    if (profile?.state && profile?.district) profileScore += 25;
    if (profile?.land_area && profile.land_area > 0) profileScore += 25;
    if (farms.length > 0) profileScore += 25;

    return res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved',
      data: {
        totalAdvisories,
        cropsCount: crops.length,
        soilReportsCount: soil.length,
        fertilizerCount: fertilizers.length,
        irrigationCount: irrigations.length,
        diseaseCount: diseases.length,
        calendarsCount: calendars.length,
        farmsCount: farms.length,
        profileCompletion: Math.min(100, profileScore),
        profile,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const client = req.userSupabase;

    const [crops, soil, fertilizers, irrigations, diseases] = await Promise.all([
      db.listAdvisories('crop_recommendations', client, userId, 5),
      db.listAdvisories('soil_reports', client, userId, 5),
      db.listAdvisories('fertilizer_advisories', client, userId, 5),
      db.listAdvisories('irrigation_advisories', client, userId, 5),
      db.listAdvisories('disease_reports', client, userId, 5),
    ]);

    const combined = [
      ...crops.map(c => ({
        id: c.id,
        type: 'crop',
        title: `Crop Recommendation (${c.input_data?.season || 'Seasonal'})`,
        date: c.created_at,
        summary: c.recommendations?.summary || 'Crop suitability assessment',
      })),
      ...soil.map(s => ({
        id: s.id,
        type: 'soil',
        title: `Soil Health Analysis (${s.soil_data?.soilType || 'Soil'})`,
        date: s.created_at,
        summary: s.analysis?.overallAssessment || 'Soil fertility assessment',
      })),
      ...fertilizers.map(f => ({
        id: f.id,
        type: 'fertilizer',
        title: `Fertilizer Plan for ${f.crop_name}`,
        date: f.created_at,
        summary: `Guidance for ${f.input_data?.growthStage || 'Growth stage'}`,
      })),
      ...irrigations.map(i => ({
        id: i.id,
        type: 'irrigation',
        title: `Irrigation Plan for ${i.crop_name}`,
        date: i.created_at,
        summary: i.advisory?.waterRequirement || 'Irrigation schedule',
      })),
      ...diseases.map(d => ({
        id: d.id,
        type: 'disease',
        title: `Disease Diagnosis (${d.crop_name})`,
        date: d.created_at,
        summary: d.symptoms || 'Symptom investigation',
      })),
    ];

    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      message: 'Recent activities retrieved',
      data: combined.slice(0, 10),
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const client = req.userSupabase;

    const calendars = await db.listAdvisories('cultivation_calendars', client, userId, 5);
    const upcomingTasks = [];

    for (const cal of calendars) {
      if (Array.isArray(cal.activities)) {
        for (const act of cal.activities) {
          if (!act.completed) {
            upcomingTasks.push({
              calendarId: cal.id,
              cropName: cal.crop_name,
              stage: act.stage,
              dayFromStart: act.dayFromStart,
              dayToStart: act.dayToStart,
              description: act.description,
              importance: act.importance,
              startDate: cal.start_date,
            });
          }
        }
      }
    }

    upcomingTasks.sort((a, b) => a.dayFromStart - b.dayFromStart);

    return res.status(200).json({
      success: true,
      message: 'Upcoming tasks retrieved',
      data: upcomingTasks.slice(0, 8),
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

