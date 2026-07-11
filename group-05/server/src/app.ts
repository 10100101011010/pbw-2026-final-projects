import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env, isProduction } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { apiRoutes } from "./routes/index.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: isProduction ? 300 : 1200,
      standardHeaders: "draft-8",
      legacyHeaders: false
    })
  );
  app.use(pinoHttp({ logger }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/api/v1", apiRoutes);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
