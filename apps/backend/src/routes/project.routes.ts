import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  saveCanvasSchema,
  createVersionSchema,
} from "../validators/project.validator";
import { createComponentSchema, updateComponentSchema } from "../validators/component.validator";
import * as projectController from "../controllers/project.controller";
import * as componentController from "../controllers/component.controller";

export const projectRouter = Router();

// All project routes require authentication
projectRouter.use(requireAuth);

// POST   /api/projects              → Create project
// GET    /api/projects              → List user's projects
// GET    /api/projects/:id          → Load project (components, connections, versions)
// PUT    /api/projects/:id          → Update project metadata
// DELETE /api/projects/:id          → Delete project
// PUT    /api/projects/:id/canvas   → Save full canvas state
// POST   /api/projects/:id/versions → Create version snapshot
// GET    /api/projects/:id/versions → List version snapshots

projectRouter.post("/", validate(createProjectSchema), projectController.create);
projectRouter.get("/", projectController.list);
projectRouter.get("/:id", projectController.getById);
projectRouter.put("/:id", validate(updateProjectSchema), projectController.update);
projectRouter.delete("/:id", projectController.remove);
projectRouter.put("/:id/canvas", validate(saveCanvasSchema), projectController.saveCanvas);
projectRouter.post("/:id/versions", validate(createVersionSchema), projectController.createVersion);
projectRouter.get("/:id/versions", projectController.listVersions);

// ── Project-scoped component CRUD ───────────────────────────
// POST   /api/projects/:id/components
// PUT    /api/projects/:id/components/:componentId
// DELETE /api/projects/:id/components/:componentId

projectRouter.post("/:id/components", requireAuth, validate(createComponentSchema), componentController.addComponent);
projectRouter.put("/:id/components/:componentId", requireAuth, validate(updateComponentSchema), componentController.updateComponent);
projectRouter.delete("/:id/components/:componentId", requireAuth, componentController.removeComponent);
