import { Router } from "express";
import { env, isProduction } from "../../config/env.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendOk } from "../../utils/api-response.js";
import { authService } from "./auth.service.js";
import { loginSchema, refreshSchema } from "./auth.schema.js";

export const authRoutes = Router();

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/api/v1/auth",
  maxAge: env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000
};

authRoutes.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password, {
      ip: req.ip,
      userAgent: req.get("user-agent")
    });
    res.cookie("gtgs_refresh", result.refreshToken, refreshCookieOptions);
    sendOk(res, result);
  })
);

authRoutes.post(
  "/refresh",
  validate({ body: refreshSchema }),
  asyncHandler(async (req, res) => {
    const token = req.cookies.gtgs_refresh || req.body.refreshToken;
    const result = await authService.refresh(token, {
      ip: req.ip,
      userAgent: req.get("user-agent")
    });
    res.cookie("gtgs_refresh", result.refreshToken, refreshCookieOptions);
    sendOk(res, result);
  })
);

authRoutes.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await authService.logout(req.cookies.gtgs_refresh || req.body?.refreshToken);
    res.clearCookie("gtgs_refresh", { path: "/api/v1/auth" });
    sendOk(res, { loggedOut: true });
  })
);

authRoutes.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    sendOk(res, await authService.me(req.user!.id));
  })
);
