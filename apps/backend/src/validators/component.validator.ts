import { z } from "zod";

export const createComponentSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
  type: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  x: z.number().finite().default(0),
  y: z.number().finite().default(0),
  width: z.number().finite().positive().default(200),
  height: z.number().finite().positive().default(120),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateComponentInput = z.infer<typeof createComponentSchema>;

export const updateComponentSchema = z.object({
  label: z.string().min(1).max(200).optional(),
  type: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  x: z.number().finite().optional(),
  y: z.number().finite().optional(),
  width: z.number().finite().positive().optional(),
  height: z.number().finite().positive().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type UpdateComponentInput = z.infer<typeof updateComponentSchema>;
