import { z } from 'zod';

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().max(20).nullable().optional(),
  country: z.string().default('India').optional(),
  state: z.string().max(100).nullable().optional(),
  district: z.string().max(100).nullable().optional(),
  village: z.string().max(100).nullable().optional(),
  preferred_language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
  farming_experience: z.number().int().nonnegative().default(0).optional(),
  land_area: z.number().nonnegative().nullable().optional(),
  land_unit: z.enum(['acre', 'hectare', 'sqm']).default('acre').optional(),
  farming_type: z.string().max(50).nullable().optional(),
  irrigation_available: z.boolean().default(false).optional(),
});

