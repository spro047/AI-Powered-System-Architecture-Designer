import type { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";

/** Safely extract a string param. Express 5 types widen to `string | string[]`. */
function param(req: Request, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0]! : val!;
}

// POST /api/projects
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.createProject(req.body, req.userId!);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.listProjects(req.userId!);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:id
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.getProjectById(param(req, "id"), req.userId!);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

// PUT /api/projects/:id
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProjectMeta(param(req, "id"), req.body, req.userId!);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/projects/:id
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await projectService.deleteProject(param(req, "id"), req.userId!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// PUT /api/projects/:id/canvas
export async function saveCanvas(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.saveCanvas(param(req, "id"), req.body, req.userId!);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

// POST /api/projects/:id/versions
export async function createVersion(req: Request, res: Response, next: NextFunction) {
  try {
    const version = await projectService.createVersion(param(req, "id"), req.body, req.userId!);
    res.status(201).json({ success: true, data: version });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:id/versions
export async function listVersions(req: Request, res: Response, next: NextFunction) {
  try {
    const versions = await projectService.listVersions(param(req, "id"), req.userId!);
    res.json({ success: true, data: versions });
  } catch (err) {
    next(err);
  }
}
