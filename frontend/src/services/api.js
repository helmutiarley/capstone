const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getPreferences() {
  return request("/preferences");
}

export function createPreferences(payload) {
  return request("/preferences", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updatePreferences(payload) {
  return request("/preferences", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deletePreferences() {
  return request("/preferences", {
    method: "DELETE",
  });
}
