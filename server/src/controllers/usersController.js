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
import { AVATAR_DIR_ABS, AVATAR_URL_PREFIX } from '../middleware/upload.js';
import { matchesImageSignature } from '../utils/fileSignature.js';

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

    if (user?.avatar?.startsWith(AVATAR_URL_PREFIX)) {
      fs.unlink(path.join(AVATAR_DIR_ABS, path.basename(user.avatar)), () => {}); // best-effort
    }

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
    // fileFilter) costs nothing to spoof — confirm the bytes on disk are
    // actually a JPEG/PNG/WEBP before trusting this upload any further.
    const filePath = path.join(AVATAR_DIR_ABS, req.file.filename);
    const header = Buffer.alloc(16);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, header, 0, 16, 0);
    fs.closeSync(fd);

    if (!matchesImageSignature(header, req.file.mimetype)) {
      fs.unlink(filePath, () => {}); // best-effort — don't leave the rejected file behind
      return res.status(400).json({ message: "File content doesn't match a valid JPEG, PNG, or WEBP image" });
    }

    const user = await User.findById(req.user._id);
    const oldAvatar = user.avatar;

    user.avatar = `${AVATAR_URL_PREFIX}${req.file.filename}`;
    await user.save();

    // Best-effort cleanup of the file this one replaces.
    if (oldAvatar && oldAvatar.startsWith(AVATAR_URL_PREFIX)) {
      fs.unlink(path.join(AVATAR_DIR_ABS, path.basename(oldAvatar)), () => {});
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/me/avatar  (protected) — reset back to initials
export async function removeUserAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    if (user.avatar && user.avatar.startsWith(AVATAR_URL_PREFIX)) {
      fs.unlink(path.join(AVATAR_DIR_ABS, path.basename(user.avatar)), () => {});
    }

    user.avatar = '';
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}
