import { env } from "../config/env";

export interface OpenAIOptions {
  model?: string;
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  format?: "json";
}

export interface OpenAIResponse {
  content: string;
  model: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature: number;
  max_tokens: number;
  stream: false;
  response_format?: { type: "json_object" };
}

interface ChatCompletionResponse {
  choices: Array<{
    message: { content: string };
    finish_reason: string;
  }>;
  model: string;
}

export async function generate(options: OpenAIOptions): Promise<OpenAIResponse> {
  const baseUrl = env.AI_BASE_URL.replace(/\/+$/, "");
  const model = options.model ?? env.AI_MODEL;

  const body: ChatCompletionRequest = {
    model,
    messages: [
      ...(options.system ? [{ role: "system" as const, content: options.system }] : []),
      { role: "user", content: options.prompt },
    ],
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 4096,
    stream: false,
  };

  // JSON mode — only enable if explicitly requested (some providers lack support)
  if (options.format === "json") {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.AI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown");
    throw new Error(`AI API error (${res.status}): ${text}`);
  }

  const data = (await res.json()) as ChatCompletionResponse;

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI returned an empty response. Please try again.");
  }

  return { content, model: data.model };
}
