import multer from "multer";
import { AppError } from "../utils/AppError";

// Files are held in memory then streamed straight to Cloudinary
// (see services/memberService.ts) — never written to disk, never stored in Postgres.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError("Only JPEG, PNG, WEBP images or PDF files are allowed", 422));
    }
    cb(null, true);
  },
});
