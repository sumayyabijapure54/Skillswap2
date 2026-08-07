import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import dns from 'node:dns';
import { connectDB } from './src/config/db.js';
import { setIO } from './src/realtime/io.js';
import { registerCallSignaling } from './src/realtime/callSignaling.js';
import { startLiveSessionScheduler } from './src/realtime/liveSessionScheduler.js';
import User from './src/models/User.js';
import app, { allowedOrigins } from './src/app.js';

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
