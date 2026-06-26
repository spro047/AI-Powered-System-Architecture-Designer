import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createComponentSchema, updateComponentSchema } from "../validators/component.validator";
import * as componentController from "../controllers/component.controller";

export const componentRouter = Router();

// GET /api/components — public (no auth needed)
componentRouter.get("/", componentController.getLibrary);

// Project-scoped component CRUD are mounted on the project router
// (these live in project.routes.ts to keep /api/projects/:id/components paths)
