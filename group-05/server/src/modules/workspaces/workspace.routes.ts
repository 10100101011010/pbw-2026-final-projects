import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { env } from "../../config/env.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendCreated, sendOk } from "../../utils/api-response.js";
import { feedbackSchema, noteSchema, revisionSchema } from "./workspace.schema.js";
import { workspaceService } from "./workspace.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new Error("Only PDF files are allowed."));
  }
});

export const workspaceRoutes = Router();

workspaceRoutes.use(requireAuth);

workspaceRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    sendOk(res, await workspaceService.list(req.user!));
  })
);

workspaceRoutes.get(
  "/:id",
  validate({ params: z.object({ id: z.string().uuid() }) }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendOk(res, await workspaceService.get(id, req.user!));
  })
);

workspaceRoutes.post(
  "/:id/notes",
  validate({ params: z.object({ id: z.string().uuid() }), body: noteSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendCreated(res, await workspaceService.addNote(id, req.user!, req.body));
  })
);

workspaceRoutes.post(
  "/:id/feedback",
  upload.single("file"),
  validate({ params: z.object({ id: z.string().uuid() }), body: feedbackSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendCreated(res, await workspaceService.addFeedback(id, req.user!, req.body, req.file));
  })
);

workspaceRoutes.post(
  "/:id/revisions",
  upload.single("file"),
  validate({ params: z.object({ id: z.string().uuid() }), body: revisionSchema }),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    sendCreated(res, await workspaceService.addRevision(id, req.user!, req.body, req.file));
  })
);

workspaceRoutes.get(
  "/attachments/:attachmentId",
  validate({ params: z.object({ attachmentId: z.string().uuid() }) }),
  asyncHandler(async (req, res) => {
    const { attachmentId } = req.params as { attachmentId: string };
    const attachment = await workspaceService.getAttachment(attachmentId, req.user!);
    res.setHeader("Content-Type", attachment.mimeType);
    res.setHeader("Content-Length", attachment.sizeBytes.toString());
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(attachment.originalFilename)}"`
    );
    res.send(Buffer.from(attachment.fileContent as Uint8Array<ArrayBuffer>));
  })
);
