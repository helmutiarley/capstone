import {
  createUserPreferences,
  deleteUserPreferences,
  getUserPreferences,
  updateUserPreferences,
} from "../repositories/preferences.repository.js";
import { deleteCacheValue, getCacheValue, setCacheValue } from "../db/redis.js";

import { validatePreferences } from "../validators/preferences.schema.js";

import { sanitizePreferences } from "../validators/preferences.schema.js";

//need to add validation and error handling in the future

const USER_PREFERENCES_CACHE_PREFIX = "userPreferences";

function getUserPreferencesCacheKey(userId) {
  return `${USER_PREFERENCES_CACHE_PREFIX}:${userId}`;
}

export async function getPreferences(userId) {
  const cacheKey = getUserPreferencesCacheKey(userId);
  const cachedPreferences = await getCacheValue(cacheKey);

  if (cachedPreferences) {
    try {
      // LOGGING
      // console.log("Cache hit for user preferences");
      return JSON.parse(cachedPreferences);
    } catch {
      await deleteCacheValue(cacheKey);
    }
  }

  const preferences = await getUserPreferences(userId);
  // LOGGING
  // console.log("Cache miss for user preferences");

  if (preferences) {
    await setCacheValue(cacheKey, JSON.stringify(preferences));
  }

  return preferences;
}

export async function setPreferences(userId, preferences) {
  const existingPreferences = await getUserPreferences(userId);

  if (existingPreferences) {
    const error = new Error("Preferences already exist");
    error.statusCode = 400;
    throw error;
  }

  const validatedPreferences = validatePreferences(preferences);

  const createdPreferences = await createUserPreferences(
    userId,
    validatedPreferences,
  );

  await setCacheValue(
    getUserPreferencesCacheKey(userId),
    JSON.stringify(createdPreferences),
  );

  return createdPreferences;
}

export async function removePreferences(userId) {
  const existingPreferences = await getUserPreferences(userId);

  if (!existingPreferences) {
    const error = new Error("Preferences not found");
    error.statusCode = 404;
    throw error;
  }

  const deletedPreferences = await deleteUserPreferences(userId);

  await deleteCacheValue(getUserPreferencesCacheKey(userId));

  return deletedPreferences;
}

export async function updatePreferences(userId, preferences) {
  const existingPreferences = await getUserPreferences(userId);

  if (!existingPreferences) {
    const error = new Error("Preferences not found");
    error.statusCode = 404;
    throw error;
  }

  const sanitizedExistingPreferences = sanitizePreferences(existingPreferences);
  const validatedNewPreferences = validatePreferences(preferences);

  const newPreferences = {
    ...sanitizedExistingPreferences,
    ...validatedNewPreferences,
  };

  const updatedPreferences = await updateUserPreferences(
    userId,
    newPreferences,
  );

  await setCacheValue(
    getUserPreferencesCacheKey(userId),
    JSON.stringify(updatedPreferences),
  );

  return updatedPreferences;
}
