import mongoose from 'mongoose';

// In-memory layer — always active, fastest, cleared on restart.
const memory = new Map(); // key -> { value, expiresAt }

const cacheSchema = new mongoose.Schema({
  key: { type: String, unique: true, index: true },
  value: mongoose.Schema.Types.Mixed,
  expiresAt: Date
}, { timestamps: true });

let CacheModel = null;
function getModel() {
  if (!mongoose.connection.readyState) return null; // not connected -> memory-only
  if (!CacheModel) CacheModel = mongoose.models.YoutubeCache || mongoose.model('YoutubeCache', cacheSchema);
  return CacheModel;
}

const ttlMs = Number(process.env.YOUTUBE_CACHE_TTL_HOURS || 12) * 60 * 60 * 1000;

export async function cacheGet(key) {
  const hit = memory.get(key);
  if (hit && hit.expiresAt > Date.now()) return { value: hit.value, stale: false };

  const Model = getModel();
  if (Model) {
    const doc = await Model.findOne({ key }).lean().catch(() => null);
    if (doc) {
      const stale = new Date(doc.expiresAt).getTime() <= Date.now();
      // Warm the memory layer regardless so we don't hit Mongo repeatedly.
      memory.set(key, { value: doc.value, expiresAt: new Date(doc.expiresAt).getTime() });
      return { value: doc.value, stale };
    }
  }

  // Fall back to an expired-but-present memory entry (better than nothing
  // if the YouTube API is down/quota-exhausted).
  if (hit) return { value: hit.value, stale: true };
  return null;
}

export async function cacheSet(key, value) {
  const expiresAt = Date.now() + ttlMs;
  memory.set(key, { value, expiresAt });

  const Model = getModel();
  if (Model) {
    await Model.updateOne(
      { key },
      { key, value, expiresAt: new Date(expiresAt) },
      { upsert: true }
    ).catch(() => { /* non-fatal — memory cache still served the request */ });
  }
}
