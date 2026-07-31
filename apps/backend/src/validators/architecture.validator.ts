import { z } from "zod";
import type { AiComponent, AiConnection, ArchitectureResult } from "../types";

export const generateArchitectureSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(5000, "Prompt too long"),
});

export type GenerateArchitectureInput = z.infer<typeof generateArchitectureSchema>;

/**
 * Validate that the AI-generated JSON conforms to the expected shape.
 * Only the pattern is constrained to known values; component/connection
 * validation is lenient to allow the AI flexibility.
 */
const knownPatterns = [
  "Monolithic",
  "Microservices",
  "Layered",
  "EventDriven",
  "Serverless",
] as const;

const aiComponentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  label: z.string().min(1),
  description: z.string(),
});

const aiConnectionSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  label: z.string(),
  type: z.string(),
});

const architectureResultSchema = z.object({
  pattern: z.enum(knownPatterns),
  description: z.string(),
  components: z.array(aiComponentSchema).min(1, "At least one component is required"),
  connections: z.array(aiConnectionSchema),
});

export function parseArchitectureResult(raw: unknown): ArchitectureResult {
  return architectureResultSchema.parse(raw);
}

/* ── Explain schema ── */

export const explainArchitectureSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  pattern: z.string().min(1),
  description: z.string(),
  components: z.array(aiComponentSchema).min(1),
  connections: z.array(aiConnectionSchema),
});

export type ExplainArchitectureInput = z.infer<typeof explainArchitectureSchema>;
