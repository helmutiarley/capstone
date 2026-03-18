import { getPreferences, setPreferences, updatePreferences, removePreferences } from '../services/preferences.service.js';

// need to add validation and error handling in the future

// need to get userId from JWT token in the future

export async function getUserPreferences(req, res) {
  try {
    const userId = req.user.id;
    const preferences = await getPreferences(userId);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function setUserPreferences(req, res) {
  try {
    const userId = req.user.id;
    const preferences = req.body;
    const updatedPreferences = await setPreferences(userId, preferences);
    res.json(updatedPreferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateUserPreferences(req, res) {
  try {
    const userId = req.user.id;
    const preferences = req.body;
    const updatedPreferences = await updatePreferences(userId, preferences);
    res.json(updatedPreferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUserPreferences(req, res) {
  try {
    const userId = req.user.id;
    await removePreferences(userId);
    res.json({ message: 'Preferences deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}