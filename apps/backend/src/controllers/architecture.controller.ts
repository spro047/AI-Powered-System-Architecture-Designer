import type { Request, Response, NextFunction } from "express";
import * as aiService from "../services/ai.service";

export async function generate(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await aiService.generateArchitecture(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
