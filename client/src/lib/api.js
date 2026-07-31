const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

const TOKEN_KEY = 'skillswap_token';
const REFRESH_KEY = 'skillswap_refresh_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ token, refreshToken } = {}) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Prevents a burst of parallel 401s (e.g. several dashboard widgets firing
// requests at once) from each independently racing to refresh the token —
// they all await this same in-flight promise instead.
let refreshPromise = null;

async function attemptRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) return false;
        setTokens(data);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, options = {}, { retry = true } = {}) {
  const token = getToken();

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  // Session expired mid-use — try one silent refresh-and-retry before
  // giving up, so a short access-token lifetime doesn't boot people out
  // of the app every few minutes.
  if (res.status === 401 && retry && token) {
    const refreshed = await attemptRefresh();
    if (refreshed) return request(path, options, { retry: false });
    clearTokens();
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error((data && data.message) || (data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' })
};

// For binary responses (e.g. server-generated PDFs) that the JSON-only
// `request()` above can't handle. Fetches with the same auth header,
// triggers a browser download, and throws with the server's JSON error
// message on failure (mirroring `request`'s error shape).
export async function downloadFile(path, filename) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const err = new Error((data && data.message) || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
