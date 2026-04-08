import { createClient } from "redis";

const DEFAULT_REDIS_TTL_SECONDS = 300;

let redisClient;
let redisConnectPromise;

function createRedisConnection() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
  });

  return redisClient;
}

export async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  const client = createRedisConnection();

  if (client.isOpen) {
    return client;
  }

  if (!redisConnectPromise) {
    redisConnectPromise = client
      .connect()
      .catch((error) => {
        console.error("Failed to connect to Redis:", error.message);
        return null;
      })
      .finally(() => {
        redisConnectPromise = null;
      });
  }

  const connectionResult = await redisConnectPromise;

  if (connectionResult === null || !client.isOpen) {
    return null;
  }

  return client;
}

export async function getCacheValue(key) {
  const client = await getRedisClient();

  if (!client) {
    return null;
  }

  try {
    return await client.get(key);
  } catch (error) {
    console.error(`Failed to read Redis key "${key}":`, error.message);
    return null;
  }
}

export async function setCacheValue(key, value, ttlSeconds = DEFAULT_REDIS_TTL_SECONDS) {
  const client = await getRedisClient();

  if (!client) {
    return;
  }

  try {
    await client.set(key, value, { EX: ttlSeconds });
  } catch (error) {
    console.error(`Failed to write Redis key "${key}":`, error.message);
  }
}

export async function deleteCacheValue(key) {
  const client = await getRedisClient();

  if (!client) {
    return;
  }

  try {
    await client.del(key);
  } catch (error) {
    console.error(`Failed to delete Redis key "${key}":`, error.message);
  }
}

export async function clearRedisCache() {
  const client = await getRedisClient();

  if (!client) {
    return false;
  }

  try {
    await client.flushDb();
    return true;
  } catch (error) {
    console.error("Failed to clear Redis cache:", error.message);
    throw error;
  }
}
