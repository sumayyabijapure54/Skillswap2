import React from 'react';

// Renders "Starts in 2d 4h 15m" and ticks down every second. Purely a
// display helper — it never flips a session's *actual* status itself
// (that always comes from the server/socket, see live-session:update),
// it just recomputes its own label so the UI doesn't look stale while
// waiting for that event.
export default function Countdown({ target, live, onReachZero }){
  const [now, setNow] = React.useState(() => Date.now());
  const firedRef = React.useRef(false);

  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = new Date(target).getTime() - now;

  React.useEffect(() => {
    if (diff <= 0 && !firedRef.current) {
      firedRef.current = true;
      onReachZero?.();
    }
  }, [diff, onReachZero]);

  if (live) return <span className="countdown-live">● LIVE NOW</span>;
  if (diff <= 0) return <span className="countdown-live">Starting…</span>;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let label;
  if (days > 0) label = `${days}d ${hours}h ${minutes}m`;
  else if (hours > 0) label = `${hours}h ${minutes}m`;
  else if (minutes > 0) label = `${minutes}m ${seconds}s`;
  else label = `${seconds}s`;

  return <span className="countdown">Starts in {label}</span>;
}
