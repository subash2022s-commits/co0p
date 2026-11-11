import { z } from 'zod';

export const soilAnalysisInputSchema = z.object({
  soilType: z.string().min(1, 'Soil type is required'),
  soilPH: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organicCarbon: z.number().nonnegative().nullable().optional(),
  electricalConductivity: z.number().nonnegative().nullable().optional(),
  micronutrients: z.string().max(200).nullable().optional(),
  additionalNotes: z.string().max(500).nullable().optional(),
  farmId: z.string().uuid().nullable().optional(),
  language: z.string().default('en'),
});

export const soilAnalysisResponseSchema = z.object({
  overallAssessment: z.string(),
  soilPHStatus: z.string(),
  nutrientAssessment: z.object({
    nitrogen: z.string().default('unknown'),
    phosphorus: z.string().default('unknown'),
    potassium: z.string().default('unknown'),
    organicCarbon: z.string().default('unknown'),
  }),
  potentialDeficiencies: z.array(z.string()).default([]),
  potentialExcesses: z.array(z.string()).default([]),
  suitableCrops: z.array(z.string()).default([]),
  improvementPractices: z.array(z.string()).default([]),
  additionalTestingRequired: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

