import { type Application } from "express";
import { CheckApiKeyMiddleware } from "./check-api-key.middleware";
import { RequestsLoggerMiddleware } from "./requests-logger.middleware";
import { ErrorHandlerMiddleware } from "./global-error.middleware";
import { MorganLoggerMiddleware } from "./console-logger.middleware";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "./check-auth.middleware";

export const initializeMiddlewares = (app: Application) => {
  // app.use(CheckApiKeyMiddleware);
  app.use(RequestsLoggerMiddleware);
  app.use(MorganLoggerMiddleware);
};

export { ErrorHandlerMiddleware as GlobalErrorHandlerMiddleware, CheckAuthMiddleware, CheckRoleMiddleware };
