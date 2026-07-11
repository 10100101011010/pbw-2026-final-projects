import type { AttachmentType, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { auditService } from "../audit/audit.service.js";
import { notificationService } from "../notifications/notification.service.js";
import { uploadService } from "../uploads/upload.service.js";
import { forbidden, notFound } from "../../utils/errors.js";

const workspaceInclude = {
  student: { include: { user: true } },
  lecturer: { include: { user: true } },
  booking: { include: { bookingRequest: true } },
  notes: { orderBy: { createdAt: "desc" } },
  feedback: { orderBy: { createdAt: "desc" }, include: { attachments: true } },
  revisions: { orderBy: { versionNumber: "desc" }, include: { attachments: true } },
  attachments: true
} satisfies Prisma.SessionWorkspaceInclude;

const redactPrivateFeedback = <T extends { feedback: { visibility: string }[] }>(
  workspace: T,
  user: Express.AuthUser
): T =>
  user.role === "STUDENT"
    ? { ...workspace, feedback: workspace.feedback.filter((item) => item.visibility === "STUDENT_VISIBLE") }
    : workspace;

const ensureWorkspaceAccess = async (workspaceId: string, user: Express.AuthUser) => {
  const workspace = await prisma.sessionWorkspace.findUnique({
    where: { id: workspaceId },
    include: workspaceInclude
  });
  if (!workspace) throw notFound("Session workspace not found.");
  const allowed =
    (user.role === "STUDENT" && user.studentProfileId === workspace.studentId) ||
    (user.role === "LECTURER" && user.lecturerProfileId === workspace.lecturerId);
  if (!allowed) throw forbidden();
  return redactPrivateFeedback(workspace, user);
};

const createAttachment = async (
  tx: Prisma.TransactionClient,
  file: Express.Multer.File,
  workspaceId: string,
  userId: string,
  attachmentType: AttachmentType,
  references: { revisionVersionId?: string | undefined; feedbackId?: string | undefined }
) => {
  uploadService.validateFile(file);
  return tx.fileAttachment.create({
    data: {
      workspaceId,
      revisionVersionId: references.revisionVersionId ?? null,
      feedbackId: references.feedbackId ?? null,
      uploadedByUserId: userId,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      fileContent: new Uint8Array(file.buffer),
      attachmentType
    }
  });
};

export const workspaceService = {
  async list(user: Express.AuthUser) {
    const profileId = user.role === "STUDENT" ? user.studentProfileId : user.lecturerProfileId;
    if (!profileId) throw notFound("Profile not found.");
    const where =
      user.role === "STUDENT"
        ? { studentId: profileId }
        : { lecturerId: profileId };
    const workspaces = await prisma.sessionWorkspace.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: workspaceInclude
    });
    return workspaces.map((workspace) => redactPrivateFeedback(workspace, user));
  },

  async get(id: string, user: Express.AuthUser) {
    return ensureWorkspaceAccess(id, user);
  },

  async addNote(id: string, user: Express.AuthUser, input: { title: string; notes: string }) {
    const workspace = await ensureWorkspaceAccess(id, user);
    if (user.role !== "LECTURER" || workspace.lecturerId !== user.lecturerProfileId) {
      throw forbidden("Only the assigned lecturer may write session notes.");
    }
    const note = await prisma.sessionNote.create({
      data: {
        workspaceId: id,
        authorUserId: user.id,
        title: input.title,
        notes: input.notes
      }
    });
    await auditService.record({
      actorUserId: user.id,
      action: "SESSION_NOTE_CREATED",
      entityType: "session_notes",
      entityId: note.id
    });
    return note;
  },

  async addFeedback(id: string, user: Express.AuthUser, input: { feedback: string; visibility: "STUDENT_VISIBLE" | "PRIVATE" }, file?: Express.Multer.File) {
    const workspace = await ensureWorkspaceAccess(id, user);
    if (user.role !== "LECTURER" || workspace.lecturerId !== user.lecturerProfileId) {
      throw forbidden("Only the assigned lecturer may add feedback.");
    }

    const feedback = await prisma.$transaction(async (tx) => {
      const created = await tx.lecturerFeedback.create({
        data: {
          workspaceId: id,
          lecturerId: workspace.lecturerId,
          feedback: input.feedback,
          visibility: input.visibility
        }
      });
      if (file) {
        await createAttachment(tx, file, id, user.id, "FEEDBACK", { feedbackId: created.id });
      }
      await auditService.record(
        {
          actorUserId: user.id,
          action: "FEEDBACK_ADDED",
          entityType: "lecturer_feedback",
          entityId: created.id
        },
        tx
      );
      return created;
    });

    await notificationService.create({
      recipientUserId: workspace.student.userId,
      type: "FEEDBACK_ADDED",
      title: "Feedback added",
      message: "Your supervisor added feedback to the session workspace.",
      entityType: "session_workspaces",
      entityId: id
    });
    return feedback;
  },

  async addRevision(id: string, user: Express.AuthUser, input: { title: string; description?: string }, file?: Express.Multer.File) {
    const workspace = await ensureWorkspaceAccess(id, user);
    if (user.role !== "STUDENT" || workspace.studentId !== user.studentProfileId) {
      throw forbidden("Only the student may upload revision files.");
    }
    if (!file) throw notFound("Revision file is required.");

    const revision = await prisma.$transaction(async (tx) => {
      const lastRevision = await tx.revisionVersion.findFirst({
        where: { workspaceId: id },
        orderBy: { versionNumber: "desc" }
      });
      const created = await tx.revisionVersion.create({
        data: {
          workspaceId: id,
          uploadedByUserId: user.id,
          versionNumber: (lastRevision?.versionNumber ?? 0) + 1,
          title: input.title,
          description: input.description ?? null,
          status: "UPLOADED"
        }
      });
      await createAttachment(tx, file, id, user.id, "REVISION", { revisionVersionId: created.id });
      await auditService.record(
        {
          actorUserId: user.id,
          action: "REVISION_UPLOADED",
          entityType: "revision_versions",
          entityId: created.id
        },
        tx
      );
      return created;
    });

    await notificationService.create({
      recipientUserId: workspace.lecturer.userId,
      type: "REVISION_UPLOADED",
      title: "Revision uploaded",
      message: `${workspace.student.fullName} uploaded a new revision version.`,
      entityType: "session_workspaces",
      entityId: id
    });
    return revision;
  },

  getAttachment: async (attachmentId: string, user: Express.AuthUser) => {
    const attachment = await prisma.fileAttachment.findUnique({
      where: { id: attachmentId },
      include: { workspace: { include: { student: { include: { user: true } }, lecturer: { include: { user: true } } } } }
    });
    if (!attachment || attachment.deletedAt) throw notFound("Attachment not found.");

    const workspace = attachment.workspace;
    const isParticipant =
      workspace.student.userId === user.id || workspace.lecturer.userId === user.id;
    if (!isParticipant) throw forbidden("You do not have access to this attachment.");

    return attachment;
  }
};
