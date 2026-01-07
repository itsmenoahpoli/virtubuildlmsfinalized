import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "http";
// removed sentry import for tests
import { initializeApiRoutes } from "@/routers";
import {
  initializeMiddlewares,
  GlobalErrorHandlerMiddleware,
} from "@/middlewares";
import { initializeDatabase, DBDataSource } from "@/database";
import { SETTINGS } from "@/configs";
import { AppEnvironments } from "@/types";
import {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions,
} from "@/configs/swagger.config";

dotenv.config();

const app = express();
let server: Server;

app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsOptions = {
  origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((o) => o.trim()),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.disable("powered-by");

initializeMiddlewares(app);

app.use(GlobalErrorHandlerMiddleware);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

const gracefulShutdown = (signal: string) => {
  console.log(`\n[SHUTDOWN]: Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error(`[SHUTDOWN]: Error closing server:`, err);
        process.exit(1);
      }
      
      console.log(`[SHUTDOWN]: Server closed successfully`);
      
      if (DBDataSource.isInitialized) {
        DBDataSource.destroy()
          .then(() => {
            console.log(`[SHUTDOWN]: Database connection closed`);
            process.exit(0);
          })
          .catch((error) => {
            console.error(`[SHUTDOWN]: Error closing database:`, error);
            process.exit(1);
          });
      } else {
        process.exit(0);
      }
    });

    setTimeout(() => {
      console.error(`[SHUTDOWN]: Forceful shutdown after timeout`);
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error(`[ERROR]: Uncaught Exception:`, error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[ERROR]: Unhandled Rejection at:`, promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

const runApp = async (): Promise<void> => {
  try {
    // Initialize database first
    console.info(`[INIT]: Initializing database...`);
    await initializeDatabase();
    console.info(`[INIT]: Database initialized successfully`);
    
    // Then initialize routes
    initializeApiRoutes(app);
    console.info(`[INIT]: API routes initialized`);
    
    const appPort = SETTINGS.APP_PORT;

    if (!appPort) {
      console.error(`[ERROR]: No app port specified from settings`);
      return;
    }

    server = app.listen(appPort, "0.0.0.0", () => {
      if (SETTINGS.APP_ENV === AppEnvironments.DEV) {
        console.info(`[APP]: App started and running in ${SETTINGS.APP_URL}`);
        console.info(
          `[SWAGGER]: API documentation available at ${SETTINGS.APP_URL}/api-docs`
        );
        console.info(`[INFO]: Press Ctrl+C to stop the server`);
      }
    });
  } catch (error) {
    console.error(`[ERROR]: Failed to initialize application:`, error);
    throw error;
  }
};

export { runApp, app };
