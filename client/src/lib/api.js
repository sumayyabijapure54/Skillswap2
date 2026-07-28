const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Adjust this if your backend uses session cookies instead of a bearer
// token — swap this for `credentials: 'include'` on the fetch below and
// drop the Authorization header.
function getToken() {
  return localStorage.getItem('skillswap_token');
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
};
