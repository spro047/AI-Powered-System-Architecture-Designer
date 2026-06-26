import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:4000/api/architecture/generate";
const COOKIE_NAME = "archigen-token";
const TIMEOUT_MS = 180_000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward JWT from cookie as Authorization header
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Architecture generation timed out. Try a simpler prompt."
          : err.message
        : "Architecture generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
