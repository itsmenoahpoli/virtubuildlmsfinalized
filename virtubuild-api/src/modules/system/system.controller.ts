import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import { HttpStatusCode } from "@/types";

export const SystemController = {
  /**
   * @swagger
   * /system/healthcheck:
   *   get:
   *     summary: System health check
   *     description: Check if the system is online and responding
   *     tags: [System]
   *     responses:
   *       200:
   *         description: System is online
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "SYSTEM_ONLINE"
   */
  healthcheck: (
    request: Request,
    response: Response,
    next: NextFunction
  ): void => {
    response
      .status(HttpStatusCode.OK)
      .json({
        message: "SYSTEM_ONLINE",
      });
  },
};
