import { Router } from "express";
import { clearCacheController } from "../controllers/cache.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.delete("/", clearCacheController);

export default router;
