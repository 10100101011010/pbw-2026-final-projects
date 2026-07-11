export type UserRole = "STUDENT" | "LECTURER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type EligibilityStatus = "ELIGIBLE" | "INCOMPLETE" | "NOT_ELIGIBLE";

export type StudentProfile = {
  id: string;
  userId: string;
  npm: string;
  fullName: string;
  studyProgram: string;
  completedSks: number;
  piCompleted: boolean;
  isSarMag: boolean;
  academicStatus: EligibilityStatus;
  syncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LecturerProfile = {
  id: string;
  userId: string;
  lecturerCode: string;
  fullName: string;
  academicTitle: string;
  department: string;
  officeLocation?: string | null;
  consultationNotes?: string | null;
  syncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: ApiUser;
};

export type ApiUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile?: StudentProfile | LecturerProfile | null;
  studentProfile?: StudentProfile | null;
  lecturerProfile?: LecturerProfile | null;
  eligibility?: EligibilityResult | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  user: ApiUser;
};

export type EligibilityResult = {
  eligible: boolean;
  status: EligibilityStatus;
  reasons: string[];
  checks: {
    officialEmail: boolean;
    minimumSks: boolean;
    piRequirement: boolean;
    hasSupervisor: boolean;
  };
};

export type SupervisorAssignment = {
  id: string;
  studentId: string;
  lecturerId: string;
  order: "FIRST" | "SECOND";
  isActive: boolean;
  lecturer: LecturerProfile;
};

export type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_APPROVED"
  | "BOOKING_REJECTED"
  | "BOOKING_CANCELLED"
  | "SCHEDULE_CHANGED"
  | "SESSION_REMINDER"
  | "REVISION_UPLOADED"
  | "FEEDBACK_ADDED";

export type AppNotification = {
  id: string;
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string | null;
  entityId?: string | null;
  readAt?: string | null;
  createdAt: string;
};

export type AvailabilityWindow = {
  id: string;
  lecturerId: string;
  windowType: "RECURRING" | "ONE_TIME";
  dayOfWeek?: number | null;
  specificDate?: string | null;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  recurrenceStartDate?: string | null;
  recurrenceEndDate?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  exceptions?: AvailabilityException[];
};

export type AvailabilityException = {
  id: string;
  availabilityWindowId: string;
  lecturerId: string;
  exceptionDate: string;
  exceptionType: "CANCELLED" | "MODIFIED";
  overrideStartTime?: string | null;
  overrideEndTime?: string | null;
  overrideSlotDurationMinutes?: number | null;
  reason?: string | null;
};

export type BookableSlot = {
  id: string;
  availabilityWindowId: string;
  lecturerId: string;
  startAt: string;
  endAt: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "PENDING" | "BOOKED";
};

export type BookingRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "EXPIRED";
export type BookingStatus = "APPROVED" | "CANCELLED" | "COMPLETED";

export type BookingRequest = {
  id: string;
  studentId: string;
  lecturerId: string;
  availabilityWindowId?: string | null;
  requestedStartAt: string;
  requestedEndAt: string;
  status: BookingRequestStatus;
  discussionTopic?: string | null;
  studentNotes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
  student?: StudentProfile;
  lecturer?: LecturerProfile;
};

export type Booking = {
  id: string;
  bookingRequestId: string;
  studentId: string;
  lecturerId: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  cancellationReason?: string | null;
  approvedAt?: string;
  cancelledAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  student?: StudentProfile;
  lecturer?: LecturerProfile;
  bookingRequest?: BookingRequest;
  workspace?: SessionWorkspace | null;
};

export type FileAttachment = {
  id: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  attachmentType: "REVISION" | "FEEDBACK" | "SESSION_SUPPORT";
  createdAt: string;
};

export type SessionNote = {
  id: string;
  title: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
};

export type LecturerFeedback = {
  id: string;
  feedback: string;
  visibility: "STUDENT_VISIBLE" | "PRIVATE";
  createdAt: string;
  attachments?: FileAttachment[];
};

export type RevisionVersion = {
  id: string;
  versionNumber: number;
  title: string;
  description?: string | null;
  status: "UPLOADED" | "REVIEWED" | "ARCHIVED";
  uploadedAt?: string;
  createdAt: string;
  attachments?: FileAttachment[];
};

export type SessionWorkspace = {
  id: string;
  bookingId: string;
  studentId: string;
  lecturerId: string;
  status: "OPEN" | "COMPLETED" | "LOCKED";
  openedAt?: string;
  completedAt?: string | null;
  lockedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  booking?: Booking;
  student?: StudentProfile;
  lecturer?: LecturerProfile;
  notes?: SessionNote[];
  feedback?: LecturerFeedback[];
  revisions?: RevisionVersion[];
  attachments?: FileAttachment[];
};

export type StudentDashboard = {
  profile: StudentProfile;
  eligibility: EligibilityResult;
  supervisors: SupervisorAssignment[];
  upcomingBookings: Booking[];
  pendingRequests: BookingRequest[];
  recentWorkspaces: SessionWorkspace[];
  notifications: AppNotification[];
  unreadCount: number;
};

export type LecturerDashboard = {
  profile: LecturerProfile;
  todayBookings: Booking[];
  pendingRequests: BookingRequest[];
  upcomingBookings: Booking[];
  availabilityWindows: AvailabilityWindow[];
  recentWorkspaces: SessionWorkspace[];
  notifications: AppNotification[];
  unreadCount: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type BookingListResponse = {
  bookings: Booking[];
  recentRequests: BookingRequest[];
  pagination: Pagination;
};

export type NotificationListResponse = {
  items: AppNotification[];
  pagination: Pagination;
  unreadCount: number;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};
