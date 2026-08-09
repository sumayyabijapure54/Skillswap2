import { useEffect, useRef, useState } from 'react';
import { getSocket } from './socket.js';

// STUN just tells each side its own public IP/port so they can attempt a
// direct connection; it carries no media and is free/keyless (Google's
// public server). Most home/office networks connect fine with STUN alone —
// carrier-grade NAT and strict corporate firewalls sometimes can't, and
// need a TURN relay (a paid/self-hosted server) to fall back to. Add one
// here (turn:your-turn-server, with credentials) before relying on this
// for a broad, unpredictable audience — this file is where that goes.
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// Wires a real peer-to-peer WebRTC connection for a single booking/session
// room. `bookingId` doubles as the call room name server-side (see
// server/src/realtime/callSignaling.js), which also scopes signaling to
// just that session's two participants.
export function useCallPeer({ bookingId, localStream, enabled }) {
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnected, setPeerConnected] = useState(false);
  const [signalingError, setSignalingError] = useState('');
  const pcRef = useRef(null);
  const remoteSocketIdRef = useRef(null);

  useEffect(() => {
    if (!enabled || !bookingId || !localStream) return undefined;

    const socket = getSocket();
    if (!socket) {
      setSignalingError('Not connected — sign in again to start a live call.');
      return undefined;
    }

    let cancelled = false;

    function createPeerConnection() {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        if (!cancelled) setRemoteStream(event.streams[0]);
      };
      pc.onconnectionstatechange = () => {
        if (cancelled) return;
        setPeerConnected(pc.connectionState === 'connected');
      };
      pc.onicecandidate = (event) => {
        if (event.candidate && remoteSocketIdRef.current) {
          socket.emit('call:signal', { to: remoteSocketIdRef.current, data: { candidate: event.candidate } });
        }
      };
      return pc;
    }

    async function callPeer(targetSocketId) {
      remoteSocketIdRef.current = targetSocketId;
      const pc = pcRef.current;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('call:signal', { to: targetSocketId, data: { sdp: offer } });
    }

    async function handleSignal({ from, data }) {
      const pc = pcRef.current;
      if (!pc) return;
      remoteSocketIdRef.current = from;

      if (data.sdp) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          if (data.sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('call:signal', { to: from, data: { sdp: answer } });
          }
        } catch (err) {
          // Was previously silent here — a state-collision exception (e.g.
          // an offer arriving while our own pc is also mid-offer) used to
          // just vanish as an unhandled rejection, leaving the call stuck
          // with no remote video and no visible error. Surface it instead.
          console.error('[call] failed applying', data.sdp.type, 'from', from, err);
          if (!cancelled) setSignalingError('Could not connect the call — please try rejoining.');
        }
      } else if (data.candidate) {
        // A candidate arriving slightly before/after negotiation settles is
        // normal and non-fatal — log it, don't surface it as a call error.
        try { await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); }
        catch (err) { console.warn('[call] ignoring late/invalid ICE candidate', err); }
      }
    }

    pcRef.current = createPeerConnection();
    const onPeerJoined = ({ socketId }) => {
      callPeer(socketId);
    };
    // IMPORTANT: the newcomer must NOT also call the peer(s) already in the
    // room. If both sides independently create+setLocalDescription(offer),
    // each pc ends up in 'have-local-offer' state, and the incoming remote
    // offer then fails setRemoteDescription with InvalidStateError — an
    // unhandled rejection that silently kills negotiation on both sides.
    // That was the actual bug: both users only ever saw their own camera
    // because ontrack never fired on either RTCPeerConnection.
    // Only the side that gets 'call:peer-joined' (i.e. was already in the
    // room) offers; the newcomer just remembers who's there and waits for
    // that incoming offer via 'call:signal'.
    const onExistingPeers = (peers) => {
      if (peers[0]) remoteSocketIdRef.current = peers[0].socketId;
    };
    const onPeerLeft = () => {
      setRemoteStream(null); setPeerConnected(false); remoteSocketIdRef.current = null;
    };
    const onError = ({ message }) => setSignalingError(message);

    socket.on('call:peer-joined', onPeerJoined);
    socket.on('call:existing-peers', onExistingPeers);
    socket.on('call:signal', handleSignal);
    socket.on('call:peer-left', onPeerLeft);
    socket.on('call:error', onError);

    socket.emit('call:join', { bookingId });

    return () => {
      cancelled = true;
      socket.emit('call:leave');
      socket.off('call:peer-joined', onPeerJoined);
      socket.off('call:existing-peers', onExistingPeers);
      socket.off('call:signal', handleSignal);
      socket.off('call:peer-left', onPeerLeft);
      socket.off('call:error', onError);
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, [enabled, bookingId, localStream]);

  return { remoteStream, peerConnected, signalingError };
}
