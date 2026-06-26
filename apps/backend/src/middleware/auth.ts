import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error-handler";

const DEV_BYPASS_HEADER = "x-user-id";
const COOKIE_NAME = "archigen-token";

/**
 * Extract a JWT from the request.
 * Priority:
 * 1. `Authorization: Bearer <token>` header
 * 2. `archigen-token` cookie (set by Next.js API route on login/register)
 * 3. `X-User-Id` header — dev-only convenience bypass
 */
function extractToken(req: Request): string | null {
  // 1. Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // 2. httpOnly cookie (forwarded by the Next.js rewrite proxy)
  const cookie = req.headers.cookie;
  if (cookie) {
    const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (match) return match.slice(COOKIE_NAME.length + 1);
  }

  return null;
}

/**
 * Authentication middleware.
 *
 * Accepts JWT from Authorization header or httpOnly cookie.
 * In dev/test, also accepts the X-User-Id header for convenience.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
      req.userId = payload.sub;
      next();
      return;
    } catch {
      next(new AppError({ status: 401, message: "Invalid or expired token." }));
      return;
    }
  }

  // Dev fallback — X-User-Id header
  if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
    const userId = req.headers[DEV_BYPASS_HEADER] as string | undefined;
    if (userId) {
      req.userId = userId;
      next();
      return;
    }
  }

  next(new AppError({ status: 401, message: "Authentication required." }));
}
