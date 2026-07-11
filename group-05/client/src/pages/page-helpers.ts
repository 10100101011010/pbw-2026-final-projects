import type {
  AppNotification,
  BookableSlot,
  Booking,
  BookingRequest,
  LecturerProfile,
  SessionWorkspace,
  StudentProfile
} from "../services/types";

export const lecturerName = (lecturer?: LecturerProfile | null) =>
  lecturer ? `${lecturer.academicTitle} ${lecturer.fullName}` : "Lecturer";

export const studentName = (student?: StudentProfile | null) => student?.fullName ?? "Student";

export const bookingTitle = (booking: Booking, viewerRole: "STUDENT" | "LECTURER") =>
  viewerRole === "STUDENT" ? lecturerName(booking.lecturer) : studentName(booking.student);

export const requestTitle = (request: BookingRequest, viewerRole: "STUDENT" | "LECTURER") =>
  viewerRole === "STUDENT" ? lecturerName(request.lecturer) : studentName(request.student);

export const workspaceTitle = (workspace: SessionWorkspace, viewerRole: "STUDENT" | "LECTURER") =>
  viewerRole === "STUDENT" ? lecturerName(workspace.lecturer) : studentName(workspace.student);

export const notificationTone = (notification: AppNotification) => (notification.readAt ? "bg-card" : "bg-primary/5");

export const slotLabel = (slot: BookableSlot) => {
  const start = new Date(slot.startAt);
  const end = new Date(slot.endAt);
  return `${start.toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "Asia/Jakarta" })} ${start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta"
  })}-${end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })}`;
};
