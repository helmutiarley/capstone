import {
  createUserPreferences,
  deleteUserPreferences,
  getUserPreferences,
  updateUserPreferences,
} from "../repositories/preferences.repository.js";

import { validatePreferences } from "../validators/preferences.schema.js";

import { sanitizePreferences } from "../validators/preferences.schema.js";

//need to add validation and error handling in the future

export async function getPreferences(userId) {
  return await getUserPreferences(userId);
}

export async function setPreferences(userId, preferences) {
  const existingPreferences = await getUserPreferences(userId);

  if (existingPreferences) {
    const error = new Error("Preferences already exist");
    error.statusCode = 400;
    throw error;
  }

  const validatedPreferences = validatePreferences(preferences);

  return await createUserPreferences(userId, validatedPreferences);
}

export async function removePreferences(userId) {
  const existingPreferences = await getUserPreferences(userId);

  if (!existingPreferences) {
    const error = new Error("Preferences not found");
    error.statusCode = 404;
    throw error;
  }

  return await deleteUserPreferences(userId);
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

  return await updateUserPreferences(userId, newPreferences);
}
