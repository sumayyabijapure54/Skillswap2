import multer from 'multer';
import fs from 'fs';
import path from 'path';

// NOTE: this stores files on local disk, which works for a single-server
// deployment but won't persist across redeploys/instances on most hosting
// platforms (Render, Railway, etc. use ephemeral filesystems). Swap the
// `storage` below for an S3/Cloudinary adapter before deploying somewhere
// with ephemeral disk — the route/controller code doesn't need to change,
// just where the file physically ends up and what URL is stored.
const AVATAR_DIR = path.join(process.cwd(), 'uploads', 'avatars');
fs.mkdirSync(AVATAR_DIR, { recursive: true });

const ALLOWED_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = ALLOWED_TYPES[file.mimetype] || path.extname(file.originalname) || '';
    // req.user is already set — this middleware only ever runs after requireAuth.
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  }
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED_TYPES[file.mimetype]) {
    return cb(new Error('Only JPEG, PNG, or WEBP images are allowed'));
  }
  cb(null, true);
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
