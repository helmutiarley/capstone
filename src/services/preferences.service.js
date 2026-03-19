import {
  createUserPreferences,
  deleteUserPreferences,
  getUserPreferences,
  updateUserPreferences,
} from "../repositories/preferences.repository.js";

//need to add validation and error handling in the future

export async function getPreferences(userId) {
  return await getUserPreferences(userId);
}

export async function setPreferences(userId, preferences) {
  const existingPreferences = await getUserPreferences(userId);
  if (existingPreferences) {
    return await updateUserPreferences(userId, preferences);
  } else {
    return await createUserPreferences(userId, preferences);
  }
}

export async function removePreferences(userId) {
  return await deleteUserPreferences(userId);
}

export async function updatePreferences(userId, preferences) {
  const existingPreferences = await getUserPreferences(userId);

  if (!existingPreferences) {
    throw new Error("Preferences not found");
  }

  const updatedPreferences = { ...existingPreferences, ...preferences };

  return await updateUserPreferences(userId, updatedPreferences);
}
