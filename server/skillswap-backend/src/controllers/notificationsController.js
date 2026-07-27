import Notification from '../models/Notification.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';

// Mirrors Notification's toJSON transform for .lean() results.
function leanNotification(n) {
  const { _id, __v, user, ...rest } = n;
  return { id: _id, ...rest };
}

async function fetchPage(userId, query) {
  const filter = { user: userId };
  const { limit, page, skip } = parsePagination(query, { defaultLimit: 50 });

  const [notifications, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter)
  ]);

  return { notifications: notifications.map(leanNotification), ...paginationMeta({ page, limit, total }) };
}

// GET /api/notifications?page=&limit=  (protected)
export async function listNotifications(req, res, next) {
  try {
    res.json(await fetchPage(req.user._id, req.query));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/:id/read  (protected)
export async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ notification });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/read-all  (protected)
export async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json(await fetchPage(req.user._id, req.query));
  } catch (err) {
    next(err);
  }
}
