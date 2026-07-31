import type { Request, Response, NextFunction } from "express";
import * as aiService from "../services/ai.service";
import { Project } from "../models";

export async function generate(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await aiService.generateArchitecture(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function explain(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, ...architecture } = req.body;

    const explanation = await aiService.explainArchitecture(req.body);

    await Project.findByIdAndUpdate(projectId, {
      $set: { explanation: { ...explanation, createdAt: new Date().toISOString() } },
    });

    res.json({ success: true, data: explanation });
  } catch (err) {
    next(err);
  }
}
