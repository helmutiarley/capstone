const requiredFields = ["email", "password"];

export function validateLoginInput(data) {
  // Check for required fields
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }

  // Validate data types
  if (typeof data.email !== "string" || typeof data.password !== "string") {
    throw new Error("Email and password must be strings");
  }

  return data;
}
