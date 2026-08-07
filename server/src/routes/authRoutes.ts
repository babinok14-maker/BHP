import { Router } from "express";
import * as authController from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema } from "../schemas/authSchema";

const router = Router();

router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.me);

export default router;
