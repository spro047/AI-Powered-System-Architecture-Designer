import "express";

declare module "express" {
  interface Request {
    /** Set by auth middleware. Undefined if request is unauthenticated. */
    userId?: string;
  }
}
