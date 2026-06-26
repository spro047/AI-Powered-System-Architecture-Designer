import { env } from "../config/env";

export interface OllamaGenerateOptions {
  model?: string;
  prompt: string;
  system?: string;
  stream?: false;
  format?: "json";
  options?: {
    temperature?: number;
    num_predict?: number;
    top_p?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
}

const BASE = env.OLLAMA_HOST;

export async function generate(options: OllamaGenerateOptions): Promise<OllamaGenerateResponse> {
  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: options.model ?? env.OLLAMA_MODEL,
      prompt: options.prompt,
      system: options.system,
      stream: false,
      format: options.format,
      options: {
        temperature: options.options?.temperature ?? 0.3,
        num_predict: options.options?.num_predict ?? 4096,
        top_p: options.options?.top_p ?? 0.9,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama API error (${res.status}): ${text}`);
  }

  return res.json() as Promise<OllamaGenerateResponse>;
}
