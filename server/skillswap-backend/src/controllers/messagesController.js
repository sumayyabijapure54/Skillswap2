import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// GET /api/messages/conversations  (protected)
// One row per other participant: their info, the last message, and how
// many of their messages to me are unread.
export async function listConversations(req, res, next) {
  try {
    const meId = req.user._id;

    const rows = await Message.aggregate([
      { $match: { $or: [{ from: meId }, { to: meId }] } },
      { $sort: { createdAt: -1 } },
      { $addFields: { other: { $cond: [{ $eq: ['$from', meId] }, '$to', '$from'] } } },
      {
        $group: {
          _id: '$other',
          lastText: { $first: '$text' },
          lastAt: { $first: '$createdAt' },
          lastFromMe: { $first: { $eq: ['$from', meId] } },
          unread: { $sum: { $cond: [{ $and: [{ $eq: ['$to', meId] }, { $eq: ['$read', false] }] }, 1, 0] } }
        }
      },
      { $sort: { lastAt: -1 } }
    ]);

    const otherIds = rows.map((r) => r._id);
    const users = await User.find({ _id: { $in: otherIds } }).select('name');
    const userById = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const conversations = rows
      .filter((r) => userById[r._id.toString()]) // skip if the other account was deleted
      .map((r) => {
        const other = userById[r._id.toString()];
        return {
          userId: r._id,
          name: other.name,
          initials: initialsOf(other.name),
          lastMessage: r.lastText,
          lastFromMe: r.lastFromMe,
          lastAt: r.lastAt,
          unread: r.unread
        };
      });

    res.json({ conversations });
  } catch (err) {
    next(err);
  }
}

// GET /api/messages/:userId  (protected)
// Full thread with one other user, oldest first. Marks their messages to
// me as read as a side effect, same as opening a notification.
export async function getThread(req, res, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const other = await User.findById(userId).select('name');
    if (!other) return res.status(404).json({ message: 'User not found' });

    const meId = req.user._id;
    const messages = await Message.find({
      $or: [
        { from: meId, to: userId },
        { from: userId, to: meId }
      ]
    }).sort({ createdAt: 1 });

    await Message.updateMany({ from: userId, to: meId, read: false }, { read: true });

    res.json({
      messages,
      otherUser: { id: other._id, name: other.name, initials: initialsOf(other.name) }
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/messages/:userId  { text }  (protected)
export async function sendMessage(req, res, next) {
  try {
    const { userId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'text is required' });
    }
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't message yourself" });
    }

    const other = await User.findById(userId).select('name');
    if (!other) return res.status(404).json({ message: 'User not found' });

    const message = await Message.create({ from: req.user._id, to: userId, text: text.trim() });

    await Notification.create({
      user: userId,
      type: 'message',
      text: `${req.user.name} sent you a message`
    });

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}
