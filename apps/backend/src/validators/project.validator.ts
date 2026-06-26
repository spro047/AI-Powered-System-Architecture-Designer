import { z } from "zod";

// ── Create ───────────────────────────────────────────────────

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  pattern: z.enum(["Monolithic", "Microservices", "Layered", "EventDriven", "Serverless"]).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ── Update metadata ─────────────────────────────────────────

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  pattern: z.enum(["Monolithic", "Microservices", "Layered", "EventDriven", "Serverless"]).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ── Save canvas (full state replacement) ────────────────────

export const saveCanvasComponentSchema = z.object({
  id: z.string().uuid().optional(), // undefined → create new
  label: z.string().min(1).max(200),
  type: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive().default(200),
  height: z.number().finite().positive().default(120),
  metadata: z.record(z.unknown()).optional(),
});

export const saveCanvasConnectionSchema = z.object({
  id: z.string().uuid().optional(), // undefined → create new
  label: z.string().max(200).optional(),
  type: z.string().default("default"),
  sourceId: z.string().uuid("Source component ID must be a valid UUID"),
  targetId: z.string().uuid("Target component ID must be a valid UUID"),
});

export const saveCanvasSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  pattern: z.enum(["Monolithic", "Microservices", "Layered", "EventDriven", "Serverless"]).optional(),
  components: z.array(saveCanvasComponentSchema).optional(),
  connections: z.array(saveCanvasConnectionSchema).optional(),
});

export type SaveCanvasInput = z.infer<typeof saveCanvasSchema>;
export type SaveCanvasComponent = z.infer<typeof saveCanvasComponentSchema>;
export type SaveCanvasConnection = z.infer<typeof saveCanvasConnectionSchema>;

// ── Version ──────────────────────────────────────────────────

export const createVersionSchema = z.object({
  label: z.string().max(200).optional(),
});

export type CreateVersionInput = z.infer<typeof createVersionSchema>;
