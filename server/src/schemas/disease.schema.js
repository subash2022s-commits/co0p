import { z } from 'zod';

export const diseaseDetectionInputSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required'),
  affectedPart: z.enum(['leaves', 'stem', 'root', 'fruit', 'flower', 'whole_plant', 'other']),
  symptoms: z.string().min(5, 'Symptoms description must be at least 5 characters'),
  duration: z.string().min(1, 'Duration is required'),
  visibleDamage: z.string().max(500).nullable().optional(),
  farmId: z.string().uuid().nullable().optional(),
  language: z.string().default('en'),
});

export const diseaseResponseSchema = z.object({
  cropName: z.string(),
  possibleConditions: z.array(
    z.object({
      name: z.string(),
      confidenceLevel: z.string(),
      supportingSymptoms: z.array(z.string()).default([]),
      alternativeCauses: z.array(z.string()).default([]),
      recommendedInspection: z.array(z.string()).default([]),
    })
  ).min(1),
  preventiveMeasures: z.array(z.string()).default([]),
  integratedPestManagement: z.array(z.string()).default([]),
  treatmentGuidance: z.array(z.string()).default([]),
  safetyWarnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(true),
});

