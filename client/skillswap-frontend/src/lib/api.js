const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
const TOKEN_KEY = 'skillswap_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Thin wrapper around fetch: prefixes the API base URL, attaches the bearer
// token when present, sends/parses JSON, and throws a real Error (with the
// backend's message) on non-2xx responses so callers can just try/catch.
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some endpoints (e.g. 204s) may have no body
  }

  if (!res.ok) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }
  return data;
}
