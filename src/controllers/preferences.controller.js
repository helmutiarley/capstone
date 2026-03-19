import {
  getPreferences,
  setPreferences,
  updatePreferences,
  removePreferences,
} from "../services/preferences.service.js";

import { getUserIdFromRequest } from "../middleware/auth.middleware.js";

import { validatePreferences } from "../validators/preferences.schema.js";

// need to add validation and error handling in the future

// need to get userId from JWT token in the future

export async function getUserPreferences(req, res) {
  try {
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const preferences = await getPreferences(userId);

    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function setUserPreferences(req, res) {
  try {
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const preferences = validatePreferences(req.body);

    const updatedPreferences = await setPreferences(userId, preferences);

    return res.json(updatedPreferences);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateUserPreferences(req, res) {
  try {
    const userId = await getUserIdFromRequest(req);
    const preferences = validatePreferences(req.body);

    const updatedPreferences = await updatePreferences(userId, preferences);
    res.json("Preferences updated successfully", updatedPreferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUserPreferences(req, res) {
  try {
    const userId = await getUserIdFromRequest(req);
    await removePreferences(userId);
    res.json({ message: "Preferences deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
