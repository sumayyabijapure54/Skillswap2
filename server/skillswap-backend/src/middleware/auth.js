import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// logged-in user (minus password) to req.user for downstream handlers.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authorized — missing or malformed token' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized — user no longer exists' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'This account has been suspended' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired — please log in again' });
    }
    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
}

// Chain after requireAuth on any /api/admin/* (or other admin-only) route.
export function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Same idea as requireAuth, but for public routes that just want to know
// *if* the request is authenticated to personalize the response — never
// rejects the request. req.user is set when a valid token is present,
// otherwise left undefined. Used by GET /api/skills/:id/full so it can
// include "have you reviewed this?" for logged-in visitors while staying
// fully accessible to anonymous ones.
export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return next();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
  } catch {
    // invalid/expired token on an optional route — just proceed as anonymous
  }
  next();
}
