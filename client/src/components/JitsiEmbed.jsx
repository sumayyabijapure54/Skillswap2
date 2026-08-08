import React from 'react';

// Loads meet.jit.si's external_api.js once per page and reuses it — several
// JitsiEmbed instances (or remounts) must never fetch/execute the script
// twice.
let scriptPromise = null;
function loadJitsiScript() {
  if (window.JitsiMeetExternalAPI) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = 'https://meet.jit.si/external_api.js';
      el.async = true;
      el.onload = resolve;
      el.onerror = () => {
        scriptPromise = null;
        reject(new Error('Could not load Jitsi'));
      };
      document.head.appendChild(el);
    });
  }
  return scriptPromise;
}

// Real JitsiMeetExternalAPI embed (not a bare iframe) — this is what makes
// participantJoined/participantLeft/videoConferenceJoined/videoConferenceLeft
// available at all. `room` MUST be the same deterministic
// `skillswap-<sessionId>` string for every participant (mentor + every
// student) — see jitsiRoomName() in liveSessionsController.js. This
// component itself never derives or mutates the room name; it only ever
// renders whatever `room` it's given, and never re-initializes on a
// re-render as long as `room` doesn't change (see the effect's dependency
// array + the api-instance ref below).
export default function JitsiEmbed({
  room,
  displayName,
  role,          // 'mentor' | 'student' — used only for the dev console log below
  sessionId,     // used only for the dev console log below
  onClose,
  onConferenceJoined,
  onConferenceLeft,
  onParticipantJoined,
  onParticipantLeft
}) {
  const containerRef = React.useRef(null);
  const apiRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[Jitsi] role=${role || 'unknown'} sessionId=${sessionId || ''} roomName=${room}`);
    }

    loadJitsiScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        // Guard against double-init (e.g. React StrictMode's double-invoke
        // of effects in dev, or a fast re-render before cleanup ran) — only
        // ever one live JitsiMeetExternalAPI instance per mounted component.
        if (apiRef.current) return;

        const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: room,
          parentNode: containerRef.current,
          userInfo: { displayName: displayName || 'SkillSwap User' },
          configOverwrite: {
            prejoinPageEnabled: true,
            disableDeepLinking: true
          },
          interfaceConfigOverwrite: {
            MOBILE_APP_PROMO: false
          }
        });
        apiRef.current = api;

        api.addEventListener('videoConferenceJoined', (evt) => {
          setReady(true);
          onConferenceJoined?.(evt);
        });
        api.addEventListener('videoConferenceLeft', (evt) => {
          onConferenceLeft?.(evt);
        });
        api.addEventListener('participantJoined', (evt) => {
          onParticipantJoined?.(evt);
        });
        api.addEventListener('participantLeft', (evt) => {
          onParticipantLeft?.(evt);
        });
        api.addEventListener('readyToClose', () => {
          onConferenceLeft?.();
          onClose?.();
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (apiRef.current) {
        // Fires videoConferenceLeft-equivalent cleanup on the Jitsi side and
        // tears down the iframe — never leave a stale API instance around
        // when the component unmounts (leaving a room, navigating away,
        // component re-rendering with a different room, etc).
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
    // Deliberately NOT depending on the on* callback props — only a change
    // in `room` (a genuinely different session/meeting) should tear down
    // and recreate the Jitsi instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  if (failed) {
    return (
      <div className="jitsi-embed-wrap">
        <div className="jitsi-embed-bar">
          <span>Could not load the video call</span>
          {onClose && <button className="btn-ghost-lg" onClick={onClose}>Close</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="jitsi-embed-wrap">
      <div className="jitsi-embed-bar">
        <span>🔴 Live session in progress</span>
        {onClose && (
          <button
            className="btn-ghost-lg"
            onClick={() => {
              apiRef.current?.executeCommand('hangup');
              onClose();
            }}
          >
            Leave
          </button>
        )}
      </div>
      <div ref={containerRef} className="jitsi-embed-frame" />
      {!ready && <div className="desc" style={{ padding: '8px 2px' }}>Connecting…</div>}
    </div>
  );
}
