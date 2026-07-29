// Centralized pool of placeholder video sources used across the app —
// course previews, lesson videos, mentor introductions, and testimonials.
//
// These are freely-licensed sample/CC0 clips (the same ones widely used for
// front-end testing) standing in for real production content. Swap the
// `src` values for real uploaded/CDN-hosted video URLs before shipping;
// nothing else in the components needs to change since they all just read
// a `videoUrl` string field.
export const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
];

export function videoForIndex(i) {
  return SAMPLE_VIDEOS[Math.abs(i) % SAMPLE_VIDEOS.length];
}
