import Booking from '../models/Booking.js';

// This module does NOT carry any video/audio media itself — it's purely
// the signaling channel WebRTC needs to let two browsers find each other:
// relaying SDP offers/answers and ICE candidates so each side's
// RTCPeerConnection can negotiate a *direct* (or TURN-relayed) media path.
// Once that handshake completes, video/audio flows peer-to-peer and this
// server sees none of it.
//
// A "call room" is named `call:<bookingId>` so signaling is automatically
// scoped to the two participants of that session — nobody can join another
// booking's room, checked against the Booking document below.

const roomKey = (bookingId) => `call:${bookingId}`;

export function registerCallSignaling(socket, io) {
  // { room -> Map<socketId, userId> } — used so "the other participant"
  // can be resolved without the client having to know their socket id.
  socket.on('call:join', async ({ bookingId }) => {
    try {
      if (!bookingId) return;
      const booking = await Booking.findById(bookingId);
      if (!booking) return socket.emit('call:error', { message: 'Session not found' });

      const isParticipant =
        booking.user?.toString() === socket.user._id.toString() ||
        booking.mentorUser?.toString() === socket.user._id.toString();
      if (!isParticipant) {
        return socket.emit('call:error', { message: 'You are not part of this session' });
      }

      const room = roomKey(bookingId);
      socket.join(room);
      socket.data.callRoom = room;

      // Tell whoever's already in the room a new peer arrived (so they can
      // initiate the SDP offer), and tell the new arrival who's already
      // there (so a lone joiner doesn't try to call an empty room).
      const others = [...(io.sockets.adapter.rooms.get(room) || [])].filter((id) => id !== socket.id);
      socket.to(room).emit('call:peer-joined', { socketId: socket.id, userId: socket.user._id, name: socket.user.name });
      socket.emit('call:existing-peers', others.map((id) => ({ socketId: id })));
    } catch {
      socket.emit('call:error', { message: 'Could not join the call' });
    }
  });

  // Relays are addressed to a specific socket id (the offerer/answerer
  // learned it from call:peer-joined / call:existing-peers) rather than
  // broadcast, since a room only ever has two people but this keeps the
  // same shape if group calls are added later.
  socket.on('call:signal', ({ to, data }) => {
    if (!to || !socket.data.callRoom) return;
    io.to(to).emit('call:signal', { from: socket.id, data });
  });

  const leaveCall = () => {
    if (socket.data.callRoom) {
      socket.to(socket.data.callRoom).emit('call:peer-left', { socketId: socket.id });
      socket.leave(socket.data.callRoom);
      socket.data.callRoom = null;
    }
  };

  socket.on('call:leave', leaveCall);
  socket.on('disconnect', leaveCall);
}
