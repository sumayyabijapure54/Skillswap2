import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import { notifyUser } from '../utils/notify.js';
import { getIO } from '../realtime/io.js';

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Mirrors Message's toJSON transform for .lean() results.
function leanMessage(m) {
  const { _id, __v, ...rest } = m;
  return { id: _id, ...rest };
}

// GET /api/messages/conversations?page=&limit=  (protected)
// One row per other participant: their info, the last message, and how
// many of their messages to me are unread.
export async function listConversations(req, res, next) {
  try {
    const meId = req.user._id;
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 30 });

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
      { $sort: { lastAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const otherIds = rows.map((r) => r._id);
    const users = await User.find({ _id: { $in: otherIds } }).select('name').lean();
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

    res.json({ conversations, page, limit });
  } catch (err) {
    next(err);
  }
}

// GET /api/messages/:userId?page=&limit=  (protected)
// Thread with one other user, oldest first. page=1 is the most recent
// `limit` messages, page=2 the ones before that, etc. Marks their messages
// to me as read as a side effect, same as opening a notification.
export async function getThread(req, res, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const other = await User.findById(userId).select('name').lean();
    if (!other) return res.status(404).json({ message: 'User not found' });

    const meId = req.user._id;
    const filter = {
      $or: [
        { from: meId, to: userId },
        { from: userId, to: meId }
      ]
    };
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 200 });

    const [recentDesc, total] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Message.countDocuments(filter)
    ]);
    const messages = recentDesc.reverse().map(leanMessage);

    await Message.updateMany({ from: userId, to: meId, read: false }, { read: true });

    res.json({
      messages,
      otherUser: { id: other._id, name: other.name, initials: initialsOf(other.name) },
      ...paginationMeta({ page, limit, total })
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

    // Push the message itself in real time — the recipient's Sessions/Messages
    // page (once wired) can just listen for 'message:new' instead of polling.
    getIO()?.to(userId.toString()).emit('message:new', message.toJSON());

    await notifyUser({
      user: userId,
      type: 'message',
      text: `${req.user.name} sent you a message`
    });

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}
