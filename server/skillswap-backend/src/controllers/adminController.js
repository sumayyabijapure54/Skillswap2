import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';

// Defensive stripping even though these fields are select:false and .lean()
// bypasses that guard for query projection, not the toJSON transform —
// same reasoning as User's own schema-level toJSON.
function leanAdminUser(u) {
  const { _id, __v, password, emailVerifyOTP, emailVerifyExpires, passwordResetToken, passwordResetExpires, ...rest } = u;
  return { id: _id, joinedAt: rest.createdAt, ...rest };
}

// GET /api/admin/users?role=&status=&q=&page=&limit=  (admin)
export async function listUsers(req, res, next) {
  try {
    const { role, status, q } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];

    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 50 });

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter)
    ]);

    res.json({ users: users.map(leanAdminUser), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/suspend  (admin)
export async function suspendUser(req, res, next) {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't suspend your own account" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status: 'suspended' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // A suspension should end their active sessions immediately, not just
    // block future logins.
    await RefreshToken.deleteMany({ user: user._id });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/reinstate  (admin)
export async function reinstateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/make-admin  (admin)
// The only way to grant admin beyond the ADMIN_EMAILS signup bootstrap.
export async function makeAdmin(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/revoke-admin  (admin)
export async function revokeAdmin(req, res, next) {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't revoke your own admin access" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
