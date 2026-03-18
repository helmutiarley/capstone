import { Router } from "express";
import {
  deleteUserPreferences,
  getUserPreferences,
  setUserPreferences,
  updateUserPreferences,
} from "../controllers/preferences.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getUserPreferences);
router.put("/", setUserPreferences);
router.patch("/", updateUserPreferences);
router.delete("/", deleteUserPreferences);

export default router;
