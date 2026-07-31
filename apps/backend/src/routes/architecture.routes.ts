import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { generateArchitectureSchema, explainArchitectureSchema } from "../validators/architecture.validator";
import * as architectureController from "../controllers/architecture.controller";

export const architectureRouter = Router();

architectureRouter.use(requireAuth);

// POST /api/architecture/generate — generate HLD from natural language prompt
architectureRouter.post("/generate", validate(generateArchitectureSchema), architectureController.generate);

// POST /api/architecture/explain — generate architecture explanation from existing design
architectureRouter.post("/explain", validate(explainArchitectureSchema), architectureController.explain);
