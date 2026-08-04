// Shared data layer for the skills catalog — replaces the static
// client/src/data/skills.js import everywhere. Every hook here talks to the
// real backend (GET /api/skills, /api/skills/meta/*, /api/skills/:id) so all
// devices/sessions see the same catalog, instead of each browser rendering
// its own bundled copy.
//
// Design goals:
//  - Callers that used to do `skills.filter(...)` / `categories.find(...)`
//    synchronously against a static array can keep that exact logic — these
//    hooks just supply the array (plus loading/error) once the fetch
//    resolves, so page-level filtering/rendering code doesn't need to change.
//  - A module-level cache means switching pages doesn't re-fetch the whole
//    catalog or re-request a skill you already loaded elsewhere.
//  - `useSkillsById` mirrors the old static `getSkillById(id)` helper's
//    call shape so call sites need minimal edits.

import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';

// ---- module-level caches (shared across all hook instances/pages) ----
let categoriesCache = null;
let levelsCache = null;
const skillsListCache = new Map(); // querystring -> { results, count, ...meta }
const skillCache = new Map();      // id -> skill (or null if a fetch found nothing)

function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) value.forEach((v) => usp.append(key, v));
    else usp.append(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

// GET /api/skills/meta/categories — same shape as the old static
// `categories` export, plus a live `count` per category from the backend.
export function useCategories() {
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoriesCache) {
      setCategories(categoriesCache);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    api.get('/api/skills/meta/categories')
      .then((data) => {
        if (!alive) return;
        categoriesCache = data;
        setCategories(data);
      })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { categories, loading, error };
}

// GET /api/skills/meta/levels — same shape as the old static `levels` export.
export function useLevels() {
  const [levels, setLevels] = useState(levelsCache || []);
  const [loading, setLoading] = useState(!levelsCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (levelsCache) {
      setLevels(levelsCache);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    api.get('/api/skills/meta/levels')
      .then((data) => {
        if (!alive) return;
        levelsCache = data;
        setLevels(data);
      })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { levels, loading, error };
}

// GET /api/skills — most pages used to filter the *entire* static array
// client-side (Explore, Home, Search, Dashboard, MentorProfile), so the
// default here fetches the full catalog (limit=200, above the 125 seeded
// skills and above the endpoint's default limit of 100) and callers keep
// their existing client-side filtering logic unchanged. Pass explicit params
// (e.g. { cat, level, q, sort }) only where server-side filtering is wanted.
export function useSkills(params = {}) {
  const finalParams = { limit: 200, ...params };
  const key = JSON.stringify(finalParams);
  const cached = skillsListCache.get(key);

  const [skills, setSkills] = useState(cached?.results || []);
  const [count, setCount] = useState(cached?.count || 0);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const existing = skillsListCache.get(key);
    if (existing) {
      setSkills(existing.results);
      setCount(existing.count);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError(null);
    api.get(`/api/skills${buildQuery(finalParams)}`)
      .then((data) => {
        if (!alive) return;
        skillsListCache.set(key, data);
        setSkills(data.results || []);
        setCount(data.count || 0);
      })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { skills, count, loading, error };
}

// GET /api/skills/:id — single-skill lookup (SkillDetail, CertificateDetail,
// LessonPlayer, etc.). Populates the shared skillCache so a skill fetched
// here is reused by useSkillsById elsewhere without a second request.
export function useSkill(id) {
  const [skill, setSkill] = useState(() => (id ? skillCache.get(id) ?? null : null));
  const [loading, setLoading] = useState(!!id && !skillCache.has(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setSkill(null);
      setLoading(false);
      return undefined;
    }
    if (skillCache.has(id)) {
      setSkill(skillCache.get(id));
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    api.get(`/api/skills/${id}`)
      .then((data) => {
        if (!alive) return;
        skillCache.set(id, data);
        setSkill(data);
      })
      .catch((err) => {
        if (!alive) return;
        skillCache.set(id, null);
        setError(err);
        setSkill(null);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  return { skill, loading, error };
}

// GET /api/skills/:id/full — the skill plus its most recent real reviews
// (and, if logged in, a completed-but-unreviewed booking to prompt for a
// review) in a single round trip. Not cached in skillCache since the
// reviews/reviewableBooking slice is per-viewer, unlike the plain skill.
export function useSkillFull(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    api.get(`/api/skills/${id}/full`)
      .then((res) => { if (alive) setData(res); })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  return {
    skill: data?.skill || null,
    reviews: data?.reviews || [],
    reviewsTotal: data?.reviewsTotal || 0,
    reviewableBooking: data?.reviewableBooking || null,
    loading,
    error
  };
}

// Batch-resolves multiple skill ids (Dashboard/MyLearning/LearningHistory/
// Certificates/Achievements all map a list of enrollments to their skills).
// Mirrors the old static `getSkillById(id)` helper's call shape — pages that
// did `enrolled.map(e => getSkillById(e.skillId))` can do
// `enrolled.map(e => getSkillById(e.skillId))` again here, just sourced from
// the hook instead of the static import.
export function useSkillsById(ids = []) {
  const uniqueIds = [...new Set((ids || []).filter(Boolean))];
  const idsKey = JSON.stringify(uniqueIds.slice().sort());
  const [, forceRender] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const missing = uniqueIds.filter((id) => !skillCache.has(id));
    if (!missing.length) return undefined;
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all(
      missing.map((id) =>
        api.get(`/api/skills/${id}`)
          .then((data) => { skillCache.set(id, data); })
          .catch((err) => { skillCache.set(id, null); return err; })
      )
    )
      .then(() => { if (alive) forceRender((n) => n + 1); })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const getSkillById = useCallback((id) => skillCache.get(id) || null, []);

  return { getSkillById, loading, error };
}
