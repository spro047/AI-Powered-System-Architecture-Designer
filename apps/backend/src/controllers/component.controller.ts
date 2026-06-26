import type { Request, Response, NextFunction } from "express";
import * as componentService from "../services/component.service";

/** Safely extract a string param. Express 5 types widen to `string | string[]`. */
function param(req: Request, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0]! : val!;
}

// GET /api/components
export async function getLibrary(_req: Request, res: Response, next: NextFunction) {
  try {
    const library = componentService.getLibrary();
    res.json({ success: true, data: library });
  } catch (err) {
    next(err);
  }
}

// POST /api/projects/:id/components
export async function addComponent(req: Request, res: Response, next: NextFunction) {
  try {
    const component = await componentService.addComponent(
      param(req, "id"),
      req.body,
      req.userId!,
    );
    res.status(201).json({ success: true, data: component });
  } catch (err) {
    next(err);
  }
}

// PUT /api/projects/:id/components/:componentId
export async function updateComponent(req: Request, res: Response, next: NextFunction) {
  try {
    const component = await componentService.updateComponent(
      param(req, "id"),
      param(req, "componentId"),
      req.body,
      req.userId!,
    );
    res.json({ success: true, data: component });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/projects/:id/components/:componentId
export async function removeComponent(req: Request, res: Response, next: NextFunction) {
  try {
    await componentService.deleteComponent(
      param(req, "id"),
      param(req, "componentId"),
      req.userId!,
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
