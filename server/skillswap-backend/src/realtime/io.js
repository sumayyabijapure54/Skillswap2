// Socket.io's server instance is created once in server.js, but controllers
// (several directories away) need to emit through it too. Rather than thread
// `io` through every function call or reach for req.app.get('io') in every
// controller, this is a tiny module-level singleton: server.js calls setIO()
// once at startup, everything else calls getIO().
//
// getIO() returns null until setIO() has run (e.g. briefly during startup,
// or in a script/test that never initializes sockets) — callers should treat
// real-time emission as a nice-to-have and guard for that, never depend on
// it for correctness.
let io = null;

export function setIO(instance) {
  io = instance;
}

export function getIO() {
  return io;
}
