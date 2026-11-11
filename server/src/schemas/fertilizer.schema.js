import { z } from 'zod';

export const fertilizerAdvisoryInputSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required'),
  cropVariety: z.string().max(100).nullable().optional(),
  growthStage: z.string().min(1, 'Growth stage is required'),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  soilType: z.string().nullable().optional(),
  soilPH: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  currentFertilizerUsage: z.string().max(500).nullable().optional(),
  farmingMethod: z.enum(['conventional', 'organic', 'integrated', 'natural']).default('integrated'),
  farmId: z.string().uuid().nullable().optional(),
  language: z.string().default('en'),
});

export const fertilizerResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  nutrientAssessment: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      fertilizerCategory: z.string(),
      purpose: z.string(),
      applicationTiming: z.string(),
      applicationMethod: z.string(),
      quantity: z.number().nullable().optional(),
      quantityUnit: z.string().nullable().optional(),
      reason: z.string(),
    })
  ).min(1, 'At least one fertilizer recommendation is required'),
  safetyPrecautions: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

