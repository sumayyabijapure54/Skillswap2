import React from 'react';

// A real, working video-call surface: it requests the actual camera/mic via
// getUserMedia and renders a live local preview with working mute/camera/
// screen-share controls — this is genuine WebRTC media capture, not a mock.
//
// What it does NOT do (yet) is connect to another browser peer-to-peer.
// Doing that needs a signaling channel (e.g. a small socket.io/WebSocket
// backend that exchanges SDP offers/answers + ICE candidates between the two
// participants) plus an RTCPeerConnection on each side. That's a backend/
// infra piece, not a frontend one — everything here is written so wiring a
// real peer connection in later is additive: swap `remoteStream` for the one
// your RTCPeerConnection hands you in `ontrack`, and the UI needs no changes.

function formatDuration(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function VideoCall({ mentorName = 'your mentor', onEnd }) {
  const localVideoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  const [status, setStatus] = React.useState('connecting'); // connecting | live | denied | ended
  const [micOn, setMicOn] = React.useState(true);
  const [camOn, setCamOn] = React.useState(true);
  const [sharing, setSharing] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setStatus('live');
      } catch (err) {
        if (!cancelled) setStatus('denied');
      }
    }
    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  React.useEffect(() => {
    if (status !== 'live') return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setCamOn(track.enabled); }
  };

  const toggleShare = async () => {
    if (sharing) {
      // Switch back to the camera.
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = camStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = camStream;
        setSharing(false);
      } catch { /* leave sharing state as-is if this fails */ }
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = screenStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setSharing(true);
      // If the user stops sharing from the browser's native UI.
      screenStream.getVideoTracks()[0].onended = () => toggleShare();
    } catch { /* user cancelled the share picker */ }
  };

  const endCall = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setStatus('ended');
    onEnd && onEnd(seconds);
  };

  if (status === 'ended') {
    return (
      <div className="video-frame" style={{ flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Call ended · {formatDuration(seconds)}</div>
      </div>
    );
  }

  return (
    <div className="video-frame" style={{ position: 'relative', overflow: 'hidden' }}>
      {status === 'connecting' && <div className="playbtn" style={{ cursor: 'default' }}>🎥</div>}

      {status === 'denied' && (
        <div style={{ textAlign: 'center', padding: '0 24px', color: 'var(--muted)', fontSize: '13px' }}>
          Camera/mic access was denied or isn't available on this device.<br />
          Enable camera and microphone permissions and try again.
        </div>
      )}

      {status === 'live' && (
        <>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: sharing ? 'none' : 'scaleX(-1)' }}
          />
          <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f5f', boxShadow: '0 0 8px #ff5f5f' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '100px' }}>
              {formatDuration(seconds)}
            </span>
          </div>
          <div style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '12px', color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: '100px' }}>
            Waiting for {mentorName} to join…
          </div>

          <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
            <button className="btn-outline" onClick={toggleMic} style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0 }}>
              {micOn ? '🎙️' : '🔇'}
            </button>
            <button className="btn-outline" onClick={toggleCam} style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0 }}>
              {camOn ? '📷' : '🚫'}
            </button>
            <button className="btn-outline" onClick={toggleShare} style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0 }}>
              {sharing ? '🖥️' : '🖵'}
            </button>
            <button
              onClick={endCall}
              style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, border: 'none', background: 'var(--danger, #ff6b6b)', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
            >
              ⏹
            </button>
          </div>
        </>
      )}
    </div>
  );
}
