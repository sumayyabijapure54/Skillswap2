export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

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
        const data = await res.json().catch(() => ({}));
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
    // This module has no React state of its own — UserContext (which does)
    // listens for this on mount and clears its cached `authed`/profile
    // state in response. Without it, a token dying mid-session (refresh
    // token itself expired, revoked, etc.) leaves the UI looking logged
    // in with stale cached data while every subsequent request just
    // 401s/throws — the user has no idea they need to log back in.
    window.dispatchEvent(new CustomEvent('skillswap:session-expired'));
  }

  // Some 2xx responses legitimately have no JSON body (204 No Content is
  // the common case, but a misbehaving proxy/edge cache can occasionally
  // serve an empty body for a 200 too). res.json() then rejects, and
  // without the fallback here `data` would be null — every call site that
  // does `data.someField` (most of them, all over the app) throws a raw
  // TypeError the moment that happens, which is a crash caused entirely
  // by this file, not by whatever the caller was actually trying to do.
  // {} makes every such access resolve to `undefined` instead, which the
  // existing `data.x || []` / `data?.x` patterns already treat as "nothing
  // there."
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error((data && data.message) || (data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// `avatar` on the user profile is a server-relative path (e.g.
// "/uploads/avatars/xxx.jpg"), same as everything else served by
// express.static — this just makes it absolute for <img src>.
export function avatarUrl(avatar) {
  if (!avatar) return null;
  if (/^https?:\/\//.test(avatar)) return avatar;
  return `${API_BASE}${avatar}`;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
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
