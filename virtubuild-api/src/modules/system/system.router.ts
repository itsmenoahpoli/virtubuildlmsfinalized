import { Router } from "express";
import { SystemController } from "./system.controller";

export const SystemRouter = Router().get("/healthcheck", SystemController.healthcheck);
