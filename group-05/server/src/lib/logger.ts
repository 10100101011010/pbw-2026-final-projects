import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : "info",
  redact: {
    paths: ["req.headers.authorization", "password", "passwordHash", "refreshToken", "tokenHash"],
    remove: true
  }
});
