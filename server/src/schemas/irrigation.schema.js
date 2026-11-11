import { z } from 'zod';

export const irrigationAdvisoryInputSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required'),
  growthStage: z.string().min(1, 'Growth stage is required'),
  soilType: z.string().min(1, 'Soil type is required'),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigationMethod: z.string().min(1, 'Irrigation method is required'),
  waterAvailability: z.enum(['abundant', 'moderate', 'scarce']).default('moderate'),
  lastRainfall: z.string().max(100).nullable().optional(),
  temperature: z.number().nullable().optional(),
  humidity: z.number().nullable().optional(),
  farmId: z.string().uuid().nullable().optional(),
  language: z.string().default('en'),
});

export const irrigationResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  waterRequirement: z.string(),
  irrigationRecommendations: z.array(
    z.object({
      timing: z.string(),
      method: z.string(),
      reason: z.string(),
    })
  ).min(1),
  waterConservationMethods: z.array(z.string()).default([]),
  waterStressIndicators: z.array(z.string()).default([]),
  drainageAdvice: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

