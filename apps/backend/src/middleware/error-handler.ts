import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface AppErrorParams {
  status: number;
  message: string;
  details?: unknown;
}

/**
 * Base application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(params: AppErrorParams) {
    super(params.message);
    this.name = "AppError";
    this.status = params.status;
    this.details = params.details;
  }
}

/**
 * Global error-handling middleware.
 * Catches ZodError, AppError, and unknown errors consistently.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors — 400
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Known application errors — custom status
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Fallback — 500
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });
}
