import { v2 as cloudinary } from 'cloudinary';

// Avatars need to survive server restarts. Most hosting platforms (Render,
// Railway, etc.) wipe local disk on every redeploy or scale-to-zero, so we
// upload to Cloudinary's free tier instead of writing to a local folder.
//
// Set CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
// (from cloudinary.com → Dashboard) to enable this. Without them, avatar
// uploads fall back to local disk — fine for local dev, NOT safe on Render.
export const CLOUDINARY_ENABLED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export default cloudinary;
