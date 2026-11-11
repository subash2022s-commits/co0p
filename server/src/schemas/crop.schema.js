import { z } from 'zod';

export const cropRecommendationInputSchema = z.object({
  state: z.string().min(1, 'State is required').max(100),
  district: z.string().min(1, 'District is required').max(100),
  soilType: z.string().min(1, 'Soil type is required'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Other', 'Year-round']),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  soilPH: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organicCarbon: z.number().nonnegative().nullable().optional(),
  temperature: z.number().nullable().optional(),
  humidity: z.number().nullable().optional(),
  rainfall: z.number().nullable().optional(),
  irrigationAvailable: z.boolean().default(false),
  preferredCategory: z.string().nullable().optional(),
  previousCrop: z.string().nullable().optional(),
  language: z.string().default('en'),
  farmId: z.string().uuid().nullable().optional(),
});

export const cropRecommendationResponseSchema = z.object({
  summary: z.string(),
  dataLimitations: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      cropName: z.string(),
      suitabilityScore: z.number().min(0).max(100),
      suitabilityLevel: z.string(),
      reason: z.string(),
      soilCompatibility: z.string(),
      climateCompatibility: z.string(),
      waterRequirement: z.string(),
      estimatedDurationDays: z.number().positive(),
      sowingPeriod: z.string(),
      risks: z.array(z.string()).default([]),
      nextSteps: z.array(z.string()).default([]),
    })
  ).min(1, 'At least one crop recommendation is required'),
  warnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(false),
});

