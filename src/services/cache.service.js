import { clearRedisCache } from "../db/redis.js";

export async function clearCache() {
  const cleared = await clearRedisCache();

  if (!cleared) {
    const error = new Error("Redis cache is not configured or unavailable");
    error.statusCode = 503;
    throw error;
  }
}
