import { env } from "../../config/env.js";
import { badRequest } from "../../utils/errors.js";

const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);
const MAX_FILE_SIZE_BYTES = env.MAX_FILE_SIZE_MB * 1024 * 1024;

export const uploadService = {
  validateFile(file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw badRequest("INVALID_FILE_TYPE", "Only PDF files are allowed.");
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw badRequest("FILE_TOO_LARGE", `File must be ${env.MAX_FILE_SIZE_MB} MB or smaller.`);
    }
    if (!file.buffer || file.buffer.length === 0) {
      throw badRequest("FILE_EMPTY", "The uploaded file is empty.");
    }
  }
};
