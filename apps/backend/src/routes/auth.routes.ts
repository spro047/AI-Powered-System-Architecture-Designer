import { Router } from "express";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { requireAuth } from "../middleware/auth";
import * as authController from "../controllers/auth.controller";

export const authRouter = Router();

// POST /api/auth/register — create account
authRouter.post("/register", validate(registerSchema), authController.register);

// POST /api/auth/login — sign in
authRouter.post("/login", validate(loginSchema), authController.login);

// GET /api/auth/me — current user profile
authRouter.get("/me", requireAuth, authController.getMe);
