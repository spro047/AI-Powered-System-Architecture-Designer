import { Router } from "express";
import { projectRouter } from "./project.routes";
import { componentRouter } from "./component.routes";
import { authRouter } from "./auth.routes";
import { architectureRouter } from "./architecture.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/projects", projectRouter);
apiRouter.use("/components", componentRouter);
apiRouter.use("/architecture", architectureRouter);
