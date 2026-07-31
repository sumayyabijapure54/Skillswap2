import { io } from 'socket.io-client';
import { getToken } from './api.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

let socket = null;

// One shared socket per browser tab, authenticated with the same JWT used
// for REST calls (server/server.js verifies it in its `io.use` middleware
// and rejects the connection outright if it's missing/invalid). Call this
// once after login/on app load; call disconnectSocket() on logout.
export function getSocket() {
  const token = getToken();
  if (!token) return null;

  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(API_BASE, {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1500,
      reconnectionAttempts: Infinity
    });
  } else {
    // Token may have rotated (refresh) since the socket was created.
    socket.auth = { token };
  }

  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
