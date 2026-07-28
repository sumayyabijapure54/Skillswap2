// Shared by every list endpoint. Keeps a generous default so existing
// callers that don't pass page/limit keep getting "everything" like
// before, while still putting a hard ceiling on how much a single
// request can pull back as data grows.
export function parsePagination(query, { defaultLimit = 50, maxLimit = 200 } = {}) {
  let limit = Number(query.limit);
  if (!Number.isFinite(limit) || limit <= 0) limit = defaultLimit;
  limit = Math.min(limit, maxLimit);

  let page = Number(query.page);
  if (!Number.isFinite(page) || page < 1) page = 1;

  const skip = (page - 1) * limit;
  return { limit, page, skip };
}

export function pageMeta(total, { page, limit }) {
  return { page, limit, pages: Math.max(Math.ceil(total / limit), 1) };
}

// .lean() returns plain objects with Mongo's raw _id/__v instead of running
// a model's toJSON transform. Use these on models whose transform is just
// "rename _id -> id, drop __v" (Booking, Review, Message, Certificate,
// Notification) to get lean()'s speed without changing the response shape.
export function leanToId(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { id: _id, ...rest };
}

// For models like Skill that keep Mongo's _id internal and expose their
// own separate `id` slug field — just strip the Mongo-only bits.
export function stripMongoMeta(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return rest;
}
