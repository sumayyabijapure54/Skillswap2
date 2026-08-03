// Mirrors server/src/utils/ytChapters.js's syntheticChapters(): splits a
// video's runtime into evenly-sized numbered segments so there's still a
// usable curriculum even without real author-provided chapters.
//
// This is only needed client-side for one edge case: a course saved with a
// mentor video *before* chapters were persisted onto Skill.youtubeVideo.
// Every video attached going forward already has real stored chapters
// (see server/src/services/youtubeService.js's getVideoByUrl), so this is
// a one-time compatibility shim, not the normal path.
export function syntheticChaptersForVideo(videoId, totalDurationSeconds, targetSegmentSeconds = 8 * 60, maxSegments = 8) {
  if (!totalDurationSeconds || totalDurationSeconds <= 0) return [];

  const count = Math.max(1, Math.min(maxSegments, Math.round(totalDurationSeconds / targetSegmentSeconds) || 1));
  const size = totalDurationSeconds / count;

  return Array.from({ length: count }, (_, i) => {
    const startSeconds = Math.round(i * size);
    const endSeconds = i === count - 1 ? totalDurationSeconds : Math.round((i + 1) * size);
    const mins = Math.round((endSeconds - startSeconds) / 60);
    return {
      id: `${videoId}-synth${i}`,
      title: `Part ${i + 1}`,
      startSeconds,
      endSeconds,
      duration: `${mins}m`
    };
  });
}
