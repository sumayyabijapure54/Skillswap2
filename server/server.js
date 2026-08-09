import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dns from 'node:dns';
import { connectDB } from './src/config/db.js';
import { validateEnv } from './src/config/validateEnv.js';
import { setIO } from './src/realtime/io.js';
import { registerCallSignaling } from './src/realtime/callSignaling.js';
import { startLiveSessionScheduler, stopLiveSessionScheduler } from './src/realtime/liveSessionScheduler.js';
import User from './src/models/User.js';
import app, { allowedOrigins } from './src/app.js';

validateEnv();

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Socket.io needs the raw http.Server (not just the Express app) to attach
// its own upgrade handling for WebSocket connections alongside normal HTTP.
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins }
});

// Client connects with: io(URL, { auth: { token: '<the same JWT used for API calls>' } })
// A rejected/missing token refuses the connection outright — there's no
// "anonymous" socket the way there's no anonymous API request.
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return next(new Error('Unauthorized'));

    socket.user = user;
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  // Every tab/device the user has open joins the same room, named after
  // their own id — notifyUser() and sendMessage() emit to this room instead
  // of tracking individual socket ids.
  socket.join(socket.user._id.toString());

  registerCallSignaling(socket, io);
});

setIO(io);

const PORT = process.env.PORT || 5002;

connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`SkillSwap API listening on http://localhost:${PORT}`));
  startLiveSessionScheduler();
});

// Graceful shutdown — Render (and most hosts) send SIGTERM before killing
// a container on redeploy/restart/scale-down; Ctrl+C sends SIGINT locally.
// Without handling these, in-flight HTTP requests get dropped mid-response
// and the Mongo connection is torn down uncleanly instead of closed.
//
// Order matters: stop the scheduler and refuse new HTTP connections first,
// then let Socket.io and Mongo close on their own terms, then exit. A hard
// timeout guarantees the process still exits even if something hangs.
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} received — starting graceful shutdown...`);

  const forceExitTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out after 10s — forcing exit.');
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref?.();

  stopLiveSessionScheduler();

  // io.close() stops accepting new Socket.io connections, forcibly
  // disconnects every currently-connected socket, and — since it owns the
  // http.Server instance created above — closes that same underlying HTTP
  // server too, waiting for in-flight REST requests to finish first.
  // (Calling io.close() rather than httpServer.close() directly avoids a
  // real deadlock: open WebSocket connections count as "active" to plain
  // httpServer.close(), which would otherwise never fire its callback
  // while any browser tab is still connected.)
  await new Promise((resolve) => io.close(() => resolve()));
  console.log('HTTP server and Socket.io closed.');

  await mongoose.connection.close();
  console.log('MongoDB connection closed.');

  clearTimeout(forceExitTimer);
  console.log('Shutdown complete.');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
