import { Router } from "express";
import * as memberController from "../controllers/memberController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { upload } from "../middleware/upload";
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdParamSchema,
} from "../schemas/memberSchema";

const router = Router();

/**
 * PUBLIC ROUTES (no auth) — consumed by the public website.
 * Always return published members only.
 */
router.get("/", memberController.listMembersPublic);
router.get("/stream", memberController.streamMembers);
router.get("/:id", validateRequest(memberIdParamSchema), memberController.getMemberPublic);

/**
 * ADMIN ROUTES (JWT-protected) — consumed by the admin dashboard.
 * Mounted under /api/admin/members in app.ts, so the paths below
 * resolve to e.g. /api/admin/members, /api/admin/members/:id/publish, etc.
 * Kept in this file (rather than a separate router) since they operate
 * on the same Member resource and share validation schemas.
 */
router.get("/admin/all", authMiddleware, memberController.listMembersAdmin);
router.get(
  "/admin/:id",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  memberController.getMemberAdmin
);
router.post(
  "/admin",
  authMiddleware,
  validateRequest(createMemberSchema),
  memberController.createMember
);
router.put(
  "/admin/:id",
  authMiddleware,
  validateRequest(updateMemberSchema),
  memberController.updateMember
);
router.delete(
  "/admin/:id",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  memberController.deleteMember
);
router.patch(
  "/admin/:id/publish",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  memberController.publishMember
);
router.patch(
  "/admin/:id/unpublish",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  memberController.unpublishMember
);
router.post(
  "/admin/:id/photo",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  upload.single("photo"),
  memberController.uploadMemberPhoto
);
router.post(
  "/admin/:id/pdf",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  upload.single("pdf"),
  memberController.uploadMemberPdf
);
router.get(
  "/admin/:id/pdf",
  authMiddleware,
  validateRequest(memberIdParamSchema),
  memberController.listMemberPdfs
);
router.delete(
  "/admin/pdf/:pdfId",
  authMiddleware,
  memberController.deleteMemberPdf
);
router.get(
  "/pdf/:pdfId",
  memberController.servePdf
);

export default router;
