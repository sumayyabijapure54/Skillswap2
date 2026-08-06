import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { CLOUDINARY_ENABLED } from '../lib/cloudinary.js';

const AVATAR_DIR = path.join(process.cwd(), 'uploads', 'avatars');
const ALLOWED_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

function fileFilter(_req, file, cb) {
  if (!ALLOWED_TYPES[file.mimetype]) {
    return cb(new Error('Only JPEG, PNG, or WEBP images are allowed'));
  }
  cb(null, true);
}

// Cloudinary path: keep the file in memory only — the controller streams
// req.file.buffer straight up to Cloudinary and never touches local disk,
// so nothing here depends on the server's filesystem surviving a restart.
//
// Local-disk fallback (CLOUDINARY_ENABLED === false): only safe for local
// dev. On Render/Railway/etc. this directory gets wiped on every redeploy
// or scale-to-zero, so uploaded avatars will eventually 404.
let storage;
if (CLOUDINARY_ENABLED) {
  storage = multer.memoryStorage();
} else {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
    filename: (req, file, cb) => {
      const ext = ALLOWED_TYPES[file.mimetype] || path.extname(file.originalname) || '';
      cb(null, `${req.user._id}-${Date.now()}${ext}`);
    }
  });
}

// Usage: router.post('/me/avatar', requireAuth, uploadAvatar, handler)
// Expects a multipart/form-data request with a single file field named "avatar".
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('avatar');

export const AVATAR_DIR_ABS = AVATAR_DIR;
export const AVATAR_URL_PREFIX = '/uploads/avatars/';
