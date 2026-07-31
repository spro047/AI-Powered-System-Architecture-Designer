import * as ollama from "./ollama";
import * as openai from "./openai-compatible";
import { buildGenerationPrompt } from "./prompts/generate";
import { buildExplainPrompt } from "./prompts/explain";
import { parseArchitectureResult } from "../validators/architecture.validator";
import type { GenerateArchitectureInput, ExplainArchitectureInput } from "../validators/architecture.validator";
import type { ArchitectureResult, ArchitectureExplanation } from "../types";
import { env } from "../config/env";

/**
 * Try the remote Qwen API first (requires AI_API_KEY).
 * Fall back to local Ollama if the key is not set or the remote call fails.
 * The remote API fails fast on auth errors (401/403) so the error surface is
 * honest — we only fall back on network/connectivity errors or missing key.
 */
export async function generateArchitecture(input: GenerateArchitectureInput): Promise<ArchitectureResult> {
  const prompt = buildGenerationPrompt(input.prompt);

  let rawContent: string;

  if (env.AI_API_KEY) {
    try {
      const result = await openai.generate({
        model: env.AI_MODEL,
        system: "You are an expert software architect. Output only valid JSON matching the requested schema.",
        prompt,
        temperature: 0.3,
        maxTokens: 4096,
        format: "json",
      });
      rawContent = result.content;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[AI] Remote API failed, falling back to Ollama:", msg);
      rawContent = await callOllama(prompt);
    }
  } else {
    rawContent = await callOllama(prompt);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("AI returned invalid JSON. Please try rephrasing your prompt.");
  }

  return parseArchitectureResult(parsed);
}

async function callOllama(prompt: string): Promise<string> {
  const result = await ollama.generate({
    prompt,
    format: "json",
    model: env.OLLAMA_MODEL,
    options: {
      temperature: 0.3,
      num_predict: 4096,
      top_p: 0.9,
    },
  });
  return result.response;
}

async function callAI(prompt: string, system?: string): Promise<string> {
  if (env.AI_API_KEY) {
    try {
      const result = await openai.generate({
        model: env.AI_MODEL,
        system: system ?? "You are an expert software architect. Output only valid JSON matching the requested schema.",
        prompt,
        temperature: 0.3,
        maxTokens: 4096,
        format: "json",
      });
      return result.content;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[AI] Remote API failed, falling back to Ollama:", msg);
    }
  }
  return callOllama(prompt);
}

export async function explainArchitecture(input: ExplainArchitectureInput): Promise<ArchitectureExplanation> {
  const prompt = buildExplainPrompt(input);

  let rawContent: string;
  if (env.AI_API_KEY) {
    try {
      const result = await openai.generate({
        model: env.AI_MODEL,
        system: "You are an expert software architect. Output only valid JSON matching the requested schema.",
        prompt,
        temperature: 0.3,
        maxTokens: 4096,
        format: "json",
      });
      rawContent = result.content;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[AI] Remote API failed, falling back to Ollama:", msg);
      rawContent = await callOllama(prompt);
    }
  } else {
    rawContent = await callOllama(prompt);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("AI returned invalid JSON when generating explanation. Please try again.");
  }

  const obj = parsed as Record<string, unknown>;
  if (!obj.summary || !obj.patternExplanation || !obj.componentExplanations || !obj.designDecisions) {
    throw new Error("AI returned incomplete explanation. Please try again.");
  }

  return obj as unknown as ArchitectureExplanation;
}
