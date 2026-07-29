import React from 'react';

// Loads the YouTube IFrame Player API script exactly once, even if several
// player instances mount across the app's lifetime.
let apiPromise = null;
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve(window.YT);
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Embedded YouTube player using the real IFrame Player API (not just a
 * plain <iframe src>) so we get reliable onEnded/progress events — required
 * for "autoplay next" plus resuming Continue Watching.
 *
 * A single video can represent an entire curriculum (chapters within one
 * video rather than separate videos per topic), so the player only remounts
 * when `videoId` itself changes. Moving between chapters of the *same*
 * video is done by seeking — exposed via `ref.current.seekTo(seconds)` —
 * which keeps a single playback session instead of reloading the iframe.
 */
const YouTubePlayer = React.forwardRef(function YouTubePlayer(
  { videoId, startSeconds = 0, onEnded, onReady, onProgress, autoplay = false },
  ref
) {
  const containerRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const progressInterval = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    seekTo(seconds, { play = true } = {}) {
      const player = playerRef.current;
      if (!player?.seekTo) return;
      player.seekTo(seconds, true);
      if (play) player.playVideo?.();
    },
    getCurrentTime() {
      return playerRef.current?.getCurrentTime?.() ?? 0;
    }
  }), []);

  React.useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          start: Math.max(0, Math.floor(startSeconds)) || undefined,
          rel: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: () => { setLoaded(true); onReady?.(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) onEnded?.();
            if (e.data === YT.PlayerState.PLAYING) {
              progressInterval.current = setInterval(() => {
                const player = playerRef.current;
                if (player?.getCurrentTime) {
                  onProgress?.(player.getCurrentTime(), player.getDuration());
                }
              }, 2000);
            } else {
              clearInterval(progressInterval.current);
            }
          }
        }
      });
    });

    return () => {
      cancelled = true;
      clearInterval(progressInterval.current);
      playerRef.current?.destroy?.();
    };
    // Intentionally only remounts on videoId change — chapter-to-chapter
    // navigation within the same video goes through seekTo() instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <div className="yt-player-wrap">
      {!loaded && (
        <div className="yt-player-skeleton" aria-hidden="true">
          <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
        </div>
      )}
      <div ref={containerRef} className="yt-player-iframe" />
    </div>
  );
});

export default YouTubePlayer;
