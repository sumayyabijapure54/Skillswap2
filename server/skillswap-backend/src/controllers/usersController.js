import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import Progress from '../models/Progress.js';
import Review from '../models/Review.js';
import Message from '../models/Message.js';
import Skill from '../models/Skill.js';

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

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role, interests: interests || [], goal: goal || null, onboarded: true },
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

    await Promise.all([
      Booking.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      Progress.deleteMany({ user: userId }),
      Review.deleteMany({ user: userId }),
      Message.deleteMany({ $or: [{ from: userId }, { to: userId }] }),
      Skill.updateMany({ mentorUser: userId }, { mentorUser: null })
    ]);

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
}
