import { describe, it, expect } from 'vitest';
import { parsePagination, paginationMeta } from '../src/utils/pagination.js';

describe('parsePagination', () => {
  it('applies defaults when nothing is passed', () => {
    expect(parsePagination({})).toEqual({ limit: 20, page: 1, skip: 0 });
  });

  it('respects custom defaultLimit/maxLimit', () => {
    expect(parsePagination({}, { defaultLimit: 100, maxLimit: 200 })).toEqual({ limit: 100, page: 1, skip: 0 });
  });

  it('caps limit at maxLimit even if the client asks for more', () => {
    expect(parsePagination({ limit: 9999 }, { maxLimit: 50 }).limit).toBe(50);
  });

  it('falls back to defaultLimit when limit=0 (falsy — Number(0) || defaultLimit takes the default branch)', () => {
    // Documents existing behavior rather than asserting what might feel more
    // intuitive: `?limit=0` does NOT floor to 1, it silently becomes
    // defaultLimit, because `0 || defaultLimit` treats 0 as falsy. Only
    // negative values reach the Math.max(...,1) floor below.
    expect(parsePagination({ limit: 0 }).limit).toBe(20);
  });

  it('floors limit at 1 when the client asks for a negative value', () => {
    expect(parsePagination({ limit: -5 }).limit).toBe(1);
  });

  it('floors page at 1 even if the client asks for 0 or negative', () => {
    expect(parsePagination({ page: 0 }).page).toBe(1);
    expect(parsePagination({ page: -3 }).page).toBe(1);
  });

  it('computes skip correctly for page > 1', () => {
    expect(parsePagination({ page: 3, limit: 10 })).toEqual({ limit: 10, page: 3, skip: 20 });
  });

  it('ignores non-numeric limit/page and falls back to defaults', () => {
    expect(parsePagination({ limit: 'abc', page: 'xyz' })).toEqual({ limit: 20, page: 1, skip: 0 });
  });
});

describe('paginationMeta', () => {
  it('computes totalPages correctly', () => {
    expect(paginationMeta({ page: 1, limit: 10, total: 25 })).toEqual({ page: 1, limit: 10, total: 25, totalPages: 3 });
  });

  it('always returns at least 1 totalPages even when total is 0', () => {
    expect(paginationMeta({ page: 1, limit: 10, total: 0 }).totalPages).toBe(1);
  });
});
