// Adds a Cache-Control header to a response. Only use this on routes whose
// response is the SAME for every requester (no per-user data, no auth
// state) — e.g. the public skill catalog and static lookup lists.
//
// This pairs with Express's built-in ETag support (enabled by default —
// see `app.set('etag', ...)`, never overridden in app.js), which already
// sends a weak ETag on every JSON response. Browsers/CDNs that revalidate
// with If-None-Match already get a 304 for free; `maxAge` on top of that
// lets a client skip the revalidation request entirely for `maxAge`
// seconds, which is the part that was actually missing.
//
// Deliberately NOT used on anything user-specific (profile, wallet,
// bookings, notifications, messages, progress, quiz attempts, admin data,
// or the optionalAuth-personalized skill detail endpoint) — caching those
// could leak one user's response to another.
export function cacheControl(maxAgeSeconds) {
  return (_req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, must-revalidate`);
    next();
  };
}
