// Shared by every list endpoint so paging works the same way everywhere:
// ?page=1&limit=20 (both optional). Caps limit so no single request can
// force the DB to return an unbounded result set.
export function parsePagination(query, { defaultLimit = 20, maxLimit = 50 } = {}) {
  const limit = Math.min(Math.max(Number(query.limit) || defaultLimit, 1), maxLimit);
  const page = Math.max(Number(query.page) || 1, 1);
  const skip = (page - 1) * limit;
  return { limit, page, skip };
}

export function paginationMeta({ page, limit, total }) {
  return { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) };
}
