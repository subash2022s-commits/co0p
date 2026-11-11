import { z } from 'zod';

export const calendarGenerateInputSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD').optional(),
  sowingMethod: z.string().max(100).nullable().optional(),
  soilType: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  farmId: z.string().uuid().nullable().optional(),
  language: z.string().default('en'),
});

export const calendarActivityUpdateSchema = z.object({
  activities: z.array(
    z.object({
      id: z.string().optional(),
      stage: z.string(),
      dayFromStart: z.number().int().nonnegative(),
      dayToStart: z.number().int().nonnegative(),
      description: z.string(),
      importance: z.string(),
      completed: z.boolean().default(false),
    })
  ),
});

export const cultivationCalendarResponseSchema = z.object({
  cropName: z.string(),
  estimatedDurationDays: z.number().positive(),
  activities: z.array(
    z.object({
      stage: z.string(),
      dayFromStart: z.number().int().nonnegative(),
      dayToStart: z.number().int().nonnegative(),
      description: z.string(),
      importance: z.string(),
      completed: z.boolean().default(false),
    })
  ).min(1),
  importantWarnings: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
});

