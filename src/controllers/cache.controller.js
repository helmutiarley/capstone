import { clearCache } from "../services/cache.service.js";

export async function clearCacheController(_req, res) {
  try {
    await clearCache();

    return res.json({ message: "Redis cache cleared successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
