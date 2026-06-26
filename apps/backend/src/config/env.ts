import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(10, "DATABASE_URL is required — set your MongoDB Atlas connection string"),
  JWT_SECRET: z.string().min(32).default("dev-jwt-secret-change-in-production"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Ollama (local fallback)
  OLLAMA_HOST: z.string().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("qwen2.5:7b"),

  // Remote OpenAI-compatible API (primary — e.g. Together AI, DeepInfra)
  AI_API_KEY: z.string().optional(),
  AI_BASE_URL: z.string().default("https://api.together.xyz/v1"),
  AI_MODEL: z.string().default("Qwen/Qwen2.5-72B-Instruct-Turbo"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
