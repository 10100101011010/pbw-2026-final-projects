-- Replace Cloudinary fields on file_attachments with a bytea column for storing file content directly in Postgres.

-- Add the new file_content column (bytea, nullable initially for safe migration).
ALTER TABLE "file_attachments" ADD COLUMN IF NOT EXISTS "file_content" bytea;

-- Drop the Cloudinary-specific columns and their constraints.
ALTER TABLE "file_attachments" DROP CONSTRAINT IF EXISTS "file_attachments_cloudinary_public_id_key";
ALTER TABLE "file_attachments" DROP COLUMN IF EXISTS "cloudinary_public_id";
ALTER TABLE "file_attachments" DROP COLUMN IF EXISTS "secure_url";
