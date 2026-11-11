import { getDiseaseAnalysis } from '../services/gemini.service.js';
import { db } from '../services/db.service.js';
import { validateImageSignature } from '../middleware/upload.js';
import { diseaseDetectionInputSchema } from '../schemas/disease.schema.js';

export const analyzeDisease = async (req, res, next) => {
  try {
    // If multipart/form-data, parse fields
    let rawBody = req.body;
    if (typeof rawBody.data === 'string') {
      try {
        rawBody = JSON.parse(rawBody.data);
      } catch {
        // use rawBody
      }
    }

    const validationResult = diseaseDetectionInputSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for disease diagnosis request',
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          details: validationResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
        },
      });
    }

    const input = validationResult.data;
    let imagePath = null;

    if (req.file) {
      const isSignatureValid = validateImageSignature(req.file.buffer);
      if (!isSignatureValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image file signature. File may be corrupted or disguised.',
          data: null,
          error: { code: 'INVALID_FILE_SIGNATURE', details: ['Image header verification failed'] },
        });
      }

      // If Supabase storage is configured, upload image to user's folder
      if (req.userSupabase) {
        const fileExt = req.file.mimetype.split('/')[1] || 'jpg';
        const fileName = `${req.user.id}/${Date.now()}_${crypto.randomUUID()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await req.userSupabase.storage
          .from('crop-images')
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (!uploadError && uploadData) {
          imagePath = uploadData.path;
        }
      } else {
        // Fallback placeholder path in demo mode
        imagePath = `uploads/${req.user.id}/${Date.now()}_${req.file.originalname}`;
      }
    }

    const analysis = await getDiseaseAnalysis(input, req.file ? req.file.buffer : null, req.file ? req.file.mimetype : null);

    const savedRecord = await db.saveAdvisory('disease_reports', req.userSupabase, req.user.id, {
      farm_id: input.farmId || null,
      crop_name: input.cropName,
      symptoms: input.symptoms,
      image_path: imagePath,
      analysis,
    });

    return res.status(200).json({
      success: true,
      message: 'Disease analysis completed successfully',
      data: savedRecord,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiseaseReports = async (req, res, next) => {
  try {
    const reports = await db.listAdvisories('disease_reports', req.userSupabase, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Disease reports retrieved successfully',
      data: reports,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiseaseReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await db.getAdvisoryById('disease_reports', req.userSupabase, req.user.id, id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Disease report not found',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Disease report retrieved',
      data: report,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDiseaseReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteAdvisory('disease_reports', req.userSupabase, req.user.id, id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or unauthorized',
        data: null,
        error: { code: 'NOT_FOUND', details: ['Record does not exist'] },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Disease report deleted successfully',
      data: { id },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

