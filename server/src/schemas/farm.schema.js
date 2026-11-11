import { z } from 'zod';

export const farmCreateSchema = z.object({
  farm_name: z.string().min(1, 'Farm name is required').max(100),
  location: z.string().max(200).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  district: z.string().max(100).nullable().optional(),
  soil_type: z.string().max(50).nullable().optional(),
  soil_ph: z.number().min(0).max(14).nullable().optional(),
  land_area: z.number().positive('Land area must be greater than 0'),
  land_unit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigation_method: z.string().max(50).nullable().optional(),
});

export const farmUpdateSchema = farmCreateSchema.partial();

