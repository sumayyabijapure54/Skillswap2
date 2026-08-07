import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import Progress from '../models/Progress.js';
import Review from '../models/Review.js';
import Message from '../models/Message.js';
import Skill from '../models/Skill.js';
import RefreshToken from '../models/RefreshToken.js';
import CommunityPost from '../models/CommunityPost.js';
import Certificate from '../models/Certificate.js';
import { AVATAR_DIR_ABS, AVATAR_URL_PREFIX } from '../middleware/upload.js';
import { matchesImageSignature } from '../utils/fileSignature.js';
import cloudinary, { CLOUDINARY_ENABLED } from '../lib/cloudinary.js';

// Best-effort delete of whatever avatar the user had before, regardless of
// which storage backend it was saved under.
function deleteOldAvatar(oldAvatar) {
  if (!oldAvatar) return;
  if (CLOUDINARY_ENABLED && /^https?:\/\/res\.cloudinary\.com\//.test(oldAvatar)) {
    // Public ID is the path segment after /upload/v<version>/, minus the extension.
    const match = oldAvatar.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (match) cloudinary.uploader.destroy(match[1]).catch(() => {}); // best-effort
  } else if (oldAvatar.startsWith(AVATAR_URL_PREFIX)) {
    fs.unlink(path.join(AVATAR_DIR_ABS, path.basename(oldAvatar)), () => {});
  }
}

const PROFILE_FIELDS = ['name', 'email', 'bio', 'avatar', 'skillsOffered', 'skillsWanted'];

// PATCH /api/users/me  (protected)
export async function updateProfile(req, res, next) {
  try {
    const updates = {};
    for (const field of PROFILE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.email) updates.email = updates.email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/me/onboarding  { role, interests, goal }  (protected)
export async function completeOnboarding(req, res, next) {
  try {
    const { role, interests, goal } = req.body;

    if (!role) return res.status(400).json({ message: 'role is required' });

    // Only touch interests/goal when the caller actually sent them — this
    // endpoint is also used later (e.g. Profile's "switch role" control) to
    // update role alone, and previously always reset interests to [] and
    // goal to null in that case, silently wiping data set during the
    // original onboarding.
    const update = { role, onboarded: true };
    if (interests !== undefined) update.interests = interests;
    if (goal !== undefined) update.goal = goal;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true, runValidators: true }
    );

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/me/password  { currentPassword, newPassword }  (protected)
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // re-hashed by the pre-save hook
    await user.save();

    // Changing the password ends every other session — if the change was
    // prompted by a compromise, this locks the attacker out immediately.
    await RefreshToken.deleteMany({ user: req.user._id });

    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/me  (protected)
// Permanently deletes the account and everything owned by it. Skills the
// user mentored are released (mentorUser -> null) rather than deleted,
// same as the explicit /skills/:id/unclaim flow, so the skill listing
// itself stays intact for other members.
export async function deleteAccount(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    await Promise.all([
      Booking.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      Progress.deleteMany({ user: userId }),
      Review.deleteMany({ user: userId }),
      Message.deleteMany({ $or: [{ from: userId }, { to: userId }] }),
      Skill.updateMany({ mentorUser: userId }, { mentorUser: null }),
      RefreshToken.deleteMany({ user: userId }),
      CommunityPost.deleteMany({ user: userId })
    ]);

    deleteOldAvatar(user?.avatar);

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/users/me/avatar  (protected, multipart/form-data, field "avatar")
export async function uploadUserAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded — send it as multipart/form-data under field "avatar"' });
    }

    // The client's declared Content-Type (already checked by multer's
    // fileFilter) costs nothing to spoof — confirm the bytes are actually
    // a JPEG/PNG/WEBP before trusting this upload any further.
    const header = CLOUDINARY_ENABLED
      ? req.file.buffer.subarray(0, 16)
      : (() => {
          const filePath = path.join(AVATAR_DIR_ABS, req.file.filename);
          const buf = Buffer.alloc(16);
          const fd = fs.openSync(filePath, 'r');
          fs.readSync(fd, buf, 0, 16, 0);
          fs.closeSync(fd);
          return buf;
        })();

    if (!matchesImageSignature(header, req.file.mimetype)) {
      if (!CLOUDINARY_ENABLED) fs.unlink(path.join(AVATAR_DIR_ABS, req.file.filename), () => {}); // best-effort
      return res.status(400).json({ message: "File content doesn't match a valid JPEG, PNG, or WEBP image" });
    }

    const user = await User.findById(req.user._id);
    const oldAvatar = user.avatar;

    if (CLOUDINARY_ENABLED) {
      // Uploads live on Cloudinary, not this server's disk, so the URL
      // keeps working across restarts/redeploys.
      const uploaded = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { folder: 'skillswap/avatars', public_id: `${req.user._id}-${Date.now()}` }
      );
      user.avatar = uploaded.secure_url;
    } else {
      user.avatar = `${AVATAR_URL_PREFIX}${req.file.filename}`;
    }
    await user.save();

    // Best-effort cleanup of the avatar this one replaces.
    deleteOldAvatar(oldAvatar);

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/me/avatar  (protected) — reset back to initials
export async function removeUserAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    deleteOldAvatar(user.avatar);

    user.avatar = '';
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id/public  (public — no auth)
// A minimal public profile: display name, avatar, bio, and any certificates
// the learner has explicitly marked visible (see Certificate.isPublic /
// PATCH /api/certificates/:skillId/visibility). Never exposes email or any
// other account field.
export async function getPublicProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id, 'name avatar bio').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const certificates = await Certificate.find({ user: user._id, isPublic: true })
      .sort({ createdAt: -1 })
      .select('skillId skillTitle mentorName mentorRole skillLevel lessonsCount courseDuration certificateNumber createdAt')
      .lean();

    res.json({
      user: { id: user._id, name: user.name, avatar: user.avatar, bio: user.bio },
      certificates: certificates.map(c => ({
        skillId: c.skillId,
        skillTitle: c.skillTitle,
        mentorName: c.mentorName,
        mentorRole: c.mentorRole,
        skillLevel: c.skillLevel,
        lessonsCount: c.lessonsCount,
        courseDuration: c.courseDuration,
        certificateNumber: c.certificateNumber,
        issuedAt: c.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
}
