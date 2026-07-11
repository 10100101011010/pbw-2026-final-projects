-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'LECTURER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AcademicStatus" AS ENUM ('ELIGIBLE', 'INCOMPLETE', 'NOT_ELIGIBLE');

-- CreateEnum
CREATE TYPE "SupervisorOrder" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "AvailabilityWindowType" AS ENUM ('RECURRING', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "AvailabilityExceptionType" AS ENUM ('CANCELLED', 'MODIFIED');

-- CreateEnum
CREATE TYPE "BookingRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('APPROVED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('OPEN', 'COMPLETED', 'LOCKED');

-- CreateEnum
CREATE TYPE "FeedbackVisibility" AS ENUM ('STUDENT_VISIBLE', 'PRIVATE');

-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('UPLOADED', 'REVIEWED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('REVISION', 'FEEDBACK', 'SESSION_SUPPORT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_CREATED', 'BOOKING_APPROVED', 'BOOKING_REJECTED', 'BOOKING_CANCELLED', 'SCHEDULE_CHANGED', 'SESSION_REMINDER', 'REVISION_UPLOADED', 'FEEDBACK_ADDED');

-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'RETRYING');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "npm" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "study_program" TEXT NOT NULL,
    "completed_sks" INTEGER NOT NULL,
    "pi_completed" BOOLEAN NOT NULL DEFAULT false,
    "is_sar_mag" BOOLEAN NOT NULL DEFAULT false,
    "academic_status" "AcademicStatus" NOT NULL DEFAULT 'NOT_ELIGIBLE',
    "synced_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "lecturer_code" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "academic_title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "office_location" TEXT,
    "consultation_notes" TEXT,
    "synced_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lecturer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_supervisors" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "supervisor_order" "SupervisorOrder" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "synced_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "student_supervisors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_by_ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_windows" (
    "id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "window_type" "AvailabilityWindowType" NOT NULL,
    "day_of_week" INTEGER,
    "specific_date" DATE,
    "start_time" VARCHAR(5) NOT NULL,
    "end_time" VARCHAR(5) NOT NULL,
    "slot_duration_minutes" INTEGER NOT NULL,
    "recurrence_start_date" DATE,
    "recurrence_end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "availability_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_exceptions" (
    "id" UUID NOT NULL,
    "availability_window_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "exception_date" DATE NOT NULL,
    "exception_type" "AvailabilityExceptionType" NOT NULL,
    "override_start_time" VARCHAR(5),
    "override_end_time" VARCHAR(5),
    "override_slot_duration_minutes" INTEGER,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "availability_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_requests" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "availability_window_id" UUID,
    "requested_start_at" TIMESTAMPTZ(3) NOT NULL,
    "requested_end_at" TIMESTAMPTZ(3) NOT NULL,
    "status" "BookingRequestStatus" NOT NULL DEFAULT 'PENDING',
    "discussion_topic" TEXT,
    "student_notes" TEXT,
    "rejection_reason" TEXT,
    "expires_at" TIMESTAMPTZ(3),
    "decided_at" TIMESTAMPTZ(3),
    "decided_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "cancelled_at" TIMESTAMPTZ(3),

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "booking_request_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "start_at" TIMESTAMPTZ(3) NOT NULL,
    "end_at" TIMESTAMPTZ(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'APPROVED',
    "cancellation_reason" TEXT,
    "approved_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by_user_id" UUID,
    "cancelled_at" TIMESTAMPTZ(3),
    "cancelled_by_user_id" UUID,
    "completed_at" TIMESTAMPTZ(3),
    "reminder_sent_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_workspaces" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "status" "WorkspaceStatus" NOT NULL DEFAULT 'OPEN',
    "opened_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(3),
    "locked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "session_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_notes" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "author_user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "session_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturer_feedback" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "lecturer_id" UUID NOT NULL,
    "feedback" TEXT NOT NULL,
    "visibility" "FeedbackVisibility" NOT NULL DEFAULT 'STUDENT_VISIBLE',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lecturer_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_versions" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "uploaded_by_user_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "RevisionStatus" NOT NULL DEFAULT 'UPLOADED',
    "uploaded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revision_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_attachments" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "revision_version_id" UUID,
    "feedback_id" UUID,
    "uploaded_by_user_id" UUID NOT NULL,
    "original_filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "cloudinary_public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "attachment_type" "AttachmentType" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "file_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "recipient_user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" UUID,
    "read_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_delivery_attempts" (
    "id" UUID NOT NULL,
    "notification_id" UUID NOT NULL,
    "recipient_user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "status" "EmailDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "sent_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "email_delivery_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_npm_key" ON "student_profiles"("npm");

-- CreateIndex
CREATE INDEX "student_profiles_user_id_idx" ON "student_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "lecturer_profiles_user_id_key" ON "lecturer_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "lecturer_profiles_lecturer_code_key" ON "lecturer_profiles"("lecturer_code");

-- CreateIndex
CREATE INDEX "lecturer_profiles_user_id_idx" ON "lecturer_profiles"("user_id");

-- CreateIndex
CREATE INDEX "student_supervisors_student_id_is_active_idx" ON "student_supervisors"("student_id", "is_active");

-- CreateIndex
CREATE INDEX "student_supervisors_lecturer_id_is_active_idx" ON "student_supervisors"("lecturer_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "student_supervisors_student_id_supervisor_order_key" ON "student_supervisors"("student_id", "supervisor_order");

-- CreateIndex
CREATE UNIQUE INDEX "student_supervisors_student_id_lecturer_id_key" ON "student_supervisors"("student_id", "lecturer_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "availability_windows_lecturer_id_is_active_idx" ON "availability_windows"("lecturer_id", "is_active");

-- CreateIndex
CREATE INDEX "availability_windows_lecturer_id_window_type_day_of_week_idx" ON "availability_windows"("lecturer_id", "window_type", "day_of_week");

-- CreateIndex
CREATE INDEX "availability_windows_lecturer_id_specific_date_idx" ON "availability_windows"("lecturer_id", "specific_date");

-- CreateIndex
CREATE INDEX "availability_exceptions_availability_window_id_exception_da_idx" ON "availability_exceptions"("availability_window_id", "exception_date");

-- CreateIndex
CREATE INDEX "availability_exceptions_lecturer_id_exception_date_idx" ON "availability_exceptions"("lecturer_id", "exception_date");

-- CreateIndex
CREATE UNIQUE INDEX "availability_exceptions_availability_window_id_exception_da_key" ON "availability_exceptions"("availability_window_id", "exception_date");

-- CreateIndex
CREATE INDEX "booking_requests_student_id_status_requested_start_at_idx" ON "booking_requests"("student_id", "status", "requested_start_at");

-- CreateIndex
CREATE INDEX "booking_requests_lecturer_id_status_requested_start_at_idx" ON "booking_requests"("lecturer_id", "status", "requested_start_at");

-- CreateIndex
CREATE INDEX "booking_requests_status_expires_at_idx" ON "booking_requests"("status", "expires_at");

-- CreateIndex
CREATE INDEX "booking_requests_lecturer_id_requested_start_at_requested_e_idx" ON "booking_requests"("lecturer_id", "requested_start_at", "requested_end_at");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_request_id_key" ON "bookings"("booking_request_id");

-- CreateIndex
CREATE INDEX "bookings_student_id_status_start_at_idx" ON "bookings"("student_id", "status", "start_at");

-- CreateIndex
CREATE INDEX "bookings_lecturer_id_status_start_at_idx" ON "bookings"("lecturer_id", "status", "start_at");

-- CreateIndex
CREATE INDEX "bookings_start_at_end_at_idx" ON "bookings"("start_at", "end_at");

-- CreateIndex
CREATE UNIQUE INDEX "session_workspaces_booking_id_key" ON "session_workspaces"("booking_id");

-- CreateIndex
CREATE INDEX "session_workspaces_student_id_created_at_idx" ON "session_workspaces"("student_id", "created_at");

-- CreateIndex
CREATE INDEX "session_workspaces_lecturer_id_created_at_idx" ON "session_workspaces"("lecturer_id", "created_at");

-- CreateIndex
CREATE INDEX "session_notes_workspace_id_created_at_idx" ON "session_notes"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "lecturer_feedback_workspace_id_created_at_idx" ON "lecturer_feedback"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "revision_versions_workspace_id_uploaded_at_idx" ON "revision_versions"("workspace_id", "uploaded_at");

-- CreateIndex
CREATE UNIQUE INDEX "revision_versions_workspace_id_version_number_key" ON "revision_versions"("workspace_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "file_attachments_cloudinary_public_id_key" ON "file_attachments"("cloudinary_public_id");

-- CreateIndex
CREATE INDEX "file_attachments_workspace_id_created_at_idx" ON "file_attachments"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_recipient_user_id_read_at_created_at_idx" ON "notifications"("recipient_user_id", "read_at", "created_at");

-- CreateIndex
CREATE INDEX "email_delivery_attempts_status_created_at_idx" ON "email_delivery_attempts"("status", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_created_at_idx" ON "audit_logs"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_created_at_idx" ON "audit_logs"("actor_user_id", "created_at");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_profiles" ADD CONSTRAINT "lecturer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_supervisors" ADD CONSTRAINT "student_supervisors_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_supervisors" ADD CONSTRAINT "student_supervisors_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_windows" ADD CONSTRAINT "availability_windows_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_availability_window_id_fkey" FOREIGN KEY ("availability_window_id") REFERENCES "availability_windows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_availability_window_id_fkey" FOREIGN KEY ("availability_window_id") REFERENCES "availability_windows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_decided_by_user_id_fkey" FOREIGN KEY ("decided_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booking_request_id_fkey" FOREIGN KEY ("booking_request_id") REFERENCES "booking_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cancelled_by_user_id_fkey" FOREIGN KEY ("cancelled_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_workspaces" ADD CONSTRAINT "session_workspaces_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_workspaces" ADD CONSTRAINT "session_workspaces_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_workspaces" ADD CONSTRAINT "session_workspaces_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "session_workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_feedback" ADD CONSTRAINT "lecturer_feedback_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "session_workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturer_feedback" ADD CONSTRAINT "lecturer_feedback_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_versions" ADD CONSTRAINT "revision_versions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "session_workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_versions" ADD CONSTRAINT "revision_versions_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "session_workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_revision_version_id_fkey" FOREIGN KEY ("revision_version_id") REFERENCES "revision_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "lecturer_feedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_delivery_attempts" ADD CONSTRAINT "email_delivery_attempts_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
