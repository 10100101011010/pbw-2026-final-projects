import type { Response } from "express";

export const sendOk = <T>(res: Response, data: T, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const sendCreated = <T>(res: Response, data: T) => sendOk(res, data, 201);
