import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

/**
 * Express middleware factory.
 * Validates the specified request part against a Zod schema.
 * On success, replaces the part with the parsed/transformed data.
 * On failure, forwards a ZodError to the global error handler.
 */
export function validate(schema: ZodSchema, source: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }
    // Replace with parsed (and possibly transformed) data
    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
}
