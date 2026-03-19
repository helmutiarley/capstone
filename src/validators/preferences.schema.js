const requiredPreferences = [
  "theme",
  "language",
  "timezone",
  "emailNotifications",
  "pushNotifications",
  "marketingOptIn",
];

export function validatePreferences(preferences) {
  if (!isPlainObject(preferences)) {
    throw new Error("Preferences must be an object");
  }

  for (const field of requiredPreferences) {
    if (!(field in preferences)) {
      throw new Error(`Missing required preference: ${field}`);
    }
  }

  for (const key of Object.keys(preferences)) {
    if (!requiredPreferences.includes(key)) {
      throw new Error(`Invalid preference key: ${key}`);
    }

    const value = preferences[key];

    if (key === "emailNotifications" && typeof value !== "boolean") {
      throw new Error("emailNotifications must be boolean");
    }

    if (key === "pushNotifications" && typeof value !== "boolean") {
      throw new Error("pushNotifications must be boolean");
    }

    if (key === "marketingOptIn" && typeof value !== "boolean") {
      throw new Error("marketingOptIn must be boolean");
    }

    if (key === "theme" && !["system", "light", "dark"].includes(value)) {
      throw new Error("Invalid theme value");
    }

    if (key === "language" && !["en", "pt", "es"].includes(value)) {
      throw new Error("Invalid language value");
    }

    if (
      key === "timezone" &&
      (typeof value !== "string" ||
        !Intl.supportedValuesOf("timeZone").includes(value))
    ) {
      throw new Error("Invalid timezone value");
    }
  }

  return preferences;
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function sanitizePreferences(preferences) {
  const sanitized = {};
  for (const key of requiredPreferences) {
    if (key in preferences) {
      sanitized[key] = preferences[key];
    }
  }
  return sanitized;
}
