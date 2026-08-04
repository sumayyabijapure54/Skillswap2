import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Review from '../models/Review.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import { notifyUser } from '../utils/notify.js';
import razorpay from '../lib/razorpayClient.js';
import { verifyOrderPaymentSignature } from '../utils/razorpaySignature.js';

// Mirrors Booking's toJSON transform, for use with .lean() query results
// (plain objects, so the schema-level transform doesn't run automatically).
function leanBooking(b) {
  const { _id, __v, user, mentorUser, ...rest } = b;
  const out = { id: _id, ...rest };
  // Mentor-side views .populate('user', 'name email') before calling this.
  if (user && typeof user === 'object' && user.name) {
    out.learner = { id: user._id, name: user.name, email: user.email };
  }
  return out;
}

// POST /api/bookings  { skillId, scheduledAt, durationMinutes?, notes? }  (protected)
export async function createBooking(req, res, next) {
  try {
    const { skillId, scheduledAt, durationMinutes, notes } = req.body;

    if (!skillId || !scheduledAt) {
      return res.status(400).json({ message: 'skillId and scheduledAt are required' });
    }

    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime())) {
      return res.status(400).json({ message: 'scheduledAt must be a valid date' });
    }
    if (when < new Date()) {
      return res.status(400).json({ message: 'scheduledAt must be in the future' });
    }

    const skill = await Skill.findOne({ id: skillId });
    if (!skill) {
      return res.status(404).json({ message: `No skill found with id "${skillId}"` });
    }

    const booking = await Booking.create({
      user: req.user._id,
      skillId: skill.id,
      skillTitle: skill.title,
      mentorName: skill.mentor.name,
      mentorInitials: skill.mentor.initials,
      mentorUser: skill.mentorUser || null,
      scheduledAt: when,
      durationMinutes: durationMinutes || 45,
      notes: notes || ''
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
}

// POST /api/bookings/checkout  { skillId, scheduledAt, durationMinutes?, notes?, sessionType, price, method }  (protected)
// Books a *paid* session and records the payment atomically — a booking
// created here can never exist unpaid, mirroring the frontend mock's
// payAndBookSession(). Wallet payments are rejected up front if the
// balance is short; card payments are just recorded (no real gateway).
export async function checkoutBooking(req, res, next) {
  const { skillId, scheduledAt, durationMinutes, notes, sessionType, price, method } = req.body;
  const when = new Date(scheduledAt);

  const session = await mongoose.startSession();
  try {
    let booking;
    let walletBalance;

    await session.withTransaction(async () => {
      const skill = await Skill.findOne({ id: skillId }).session(session);
      if (!skill) {
        throw Object.assign(new Error(`No skill found with id "${skillId}"`), { status: 404 });
      }

      const user = await User.findById(req.user._id).session(session);

      if (method === 'wallet' && user.wallet.balance < price) {
        throw Object.assign(new Error('Insufficient wallet balance'), { status: 400 });
      }

      const [created] = await Booking.create(
        [
          {
            user: user._id,
            skillId: skill.id,
            skillTitle: skill.title,
            mentorName: skill.mentor.name,
            mentorInitials: skill.mentor.initials,
            mentorUser: skill.mentorUser || null,
            scheduledAt: when,
            durationMinutes: durationMinutes || 45,
            notes: notes || '',
            sessionType,
            price,
            paid: true,
            paymentMethod: method
          }
        ],
        { session }
      );
      booking = created;

      if (method === 'wallet') {
        user.wallet.balance = +(user.wallet.balance - price).toFixed(2);
        await user.save({ session });
      }
      walletBalance = user.wallet.balance;

      await Transaction.create(
        [
          {
            user: user._id,
            type: 'session_payment',
            amount: -price,
            method,
            description: `${sessionType} session booking`,
            booking: booking._id
          }
        ],
        { session }
      );
    });

    await notifyUser({
      user: req.user._id,
      type: 'booking',
      text: `Your ${sessionType} session is booked for ${when.toLocaleDateString()}.`
    });

    res.status(201).json({ booking, wallet: { balance: walletBalance } });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  } finally {
    session.endSession();
  }
}

// PATCH /api/bookings/:id/notes  { notes }  (protected — the learner who booked it)
// Private to the learner — never shown to the mentor.
export async function updateBookingNotes(req, res, next) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.notes = req.body.notes || '';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/:id  (protected — the learner who booked it, or the mentor)
export async function getBooking(req, res, next) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { mentorUser: req.user._id }]
    }).lean();
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking: leanBooking(booking) });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings?when=upcoming|past&page=&limit=  (protected)
export async function listBookings(req, res, next) {
  try {
    const { when } = req.query;
    const filter = { user: req.user._id, status: { $ne: 'cancelled' } };

    if (when === 'upcoming') filter.scheduledAt = { $gte: new Date() };
    else if (when === 'past') filter.scheduledAt = { $lt: new Date() };

    const sortDir = when === 'past' ? -1 : 1;
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 50 });

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ scheduledAt: sortDir }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter)
    ]);

    res.json({ bookings: bookings.map(leanBooking), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/bookings/:id/cancel  (protected — the learner who booked it)
// If the booking was paid for and hadn't already happened, the price is
// refunded to the learner's wallet regardless of the original payment
// method (matching the frontend mock's cancelBooking behavior) and logged
// as a `refund` transaction.
export async function cancelBooking(req, res, next) {
  const session = await mongoose.startSession();
  try {
    let booking;
    let walletBalance;

    await session.withTransaction(async () => {
      const existing = await Booking.findOne({ _id: req.params.id, user: req.user._id }).session(session);
      if (!existing) {
        throw Object.assign(new Error('Booking not found'), { status: 404 });
      }

      const shouldRefund = existing.paid && existing.status === 'confirmed';

      existing.status = 'cancelled';
      await existing.save({ session });
      booking = existing;

      if (shouldRefund) {
        const user = await User.findById(req.user._id).session(session);
        user.wallet.balance = +(user.wallet.balance + existing.price).toFixed(2);
        await user.save({ session });
        walletBalance = user.wallet.balance;

        await Transaction.create(
          [
            {
              user: req.user._id,
              type: 'refund',
              amount: existing.price,
              method: 'wallet',
              description: `Refund for cancelled ${existing.sessionType || 'session'} booking`,
              booking: existing._id
            }
          ],
          { session }
        );
      }
    });

    res.json({ booking, wallet: walletBalance !== undefined ? { balance: walletBalance } : undefined });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  } finally {
    session.endSession();
  }
}

// GET /api/bookings/mentor?when=upcoming|past&page=&limit=  (protected)
// Sessions booked with skills the current user mentors. Reads mentorUser
// directly off the booking (denormalized at creation) instead of first
// looking up which skills the mentor owns — one indexed query instead of
// two. Note: bookings created before this field existed won't match; a
// one-time backfill (`mentorUser = skill.mentorUser` per skillId) would be
// needed to bring old data along if this is deployed onto an existing DB.
export async function listMentorBookings(req, res, next) {
  try {
    const { when } = req.query;
    const filter = { mentorUser: req.user._id, status: { $ne: 'cancelled' } };

    if (when === 'upcoming') filter.scheduledAt = { $gte: new Date() };
    else if (when === 'past') filter.scheduledAt = { $lt: new Date() };

    const sortDir = when === 'past' ? -1 : 1;
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 50 });

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ scheduledAt: sortDir }).skip(skip).limit(limit).populate('user', 'name email').lean(),
      Booking.countDocuments(filter)
    ]);

    res.json({ bookings: bookings.map(leanBooking), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// Shared guard: only the mentor of the booking may act on it as a mentor.
async function findBookingAsMentor(bookingId, mentorUserId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return { error: 404, message: 'Booking not found' };

  if (!booking.mentorUser || booking.mentorUser.toString() !== mentorUserId.toString()) {
    return { error: 403, message: "You're not the mentor for this session" };
  }
  return { booking };
}

// PATCH /api/bookings/:id/mentor-cancel  (protected — the mentor)
export async function mentorCancelBooking(req, res, next) {
  try {
    const { booking, error, message } = await findBookingAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/bookings/:id/complete  (protected — the mentor)
export async function completeBooking(req, res, next) {
  try {
    const { booking, error, message } = await findBookingAsMentor(req.params.id, req.user._id);
    if (error) return res.status(error).json({ message });

    booking.status = 'completed';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/mentor/earnings  (protected)
// Real numbers for the Mentor Dashboard stat row, computed from actual
// paid/completed bookings and reviews instead of the frontend's current
// deterministic placeholder math.
export async function getMentorEarnings(req, res, next) {
  try {
    const mentorUser = req.user._id;

    const [earningsAgg] = await Booking.aggregate([
      { $match: { mentorUser, status: 'completed', paid: true } },
      { $group: { _id: null, total: { $sum: '$price' }, students: { $addToSet: '$user' } } }
    ]);

    const upcomingCount = await Booking.countDocuments({
      mentorUser,
      status: 'confirmed',
      scheduledAt: { $gte: new Date() }
    });

    const [ratingAgg] = await Review.aggregate([
      { $match: { mentorUser } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    res.json({
      earnings: earningsAgg ? +earningsAgg.total.toFixed(2) : 0,
      studentsCount: earningsAgg ? earningsAgg.students.length : 0,
      upcomingCount,
      avgRating: ratingAgg ? Math.round(ratingAgg.avg * 10) / 10 : 0,
      reviewsCount: ratingAgg ? ratingAgg.count : 0
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/mentor/students?skillId=&q=  (protected)
// One row per distinct learner who has booked (any status other than
// cancelled) a session with this mentor, optionally scoped to one course.
// Aggregated straight off Booking so it stays correct without a separate
// enrollment table — session count / spend / last-seen all derive from the
// same records the earnings and analytics endpoints already trust.
export async function getMentorStudents(req, res, next) {
  try {
    const mentorUser = req.user._id;
    const { skillId, q } = req.query;

    const match = { mentorUser, status: { $ne: 'cancelled' } };
    if (skillId) match.skillId = skillId;

    const rows = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$user',
          sessionsCount: { $sum: 1 },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          totalSpent: { $sum: { $cond: ['$paid', '$price', 0] } },
          skills: { $addToSet: { skillId: '$skillId', skillTitle: '$skillTitle' } },
          firstSession: { $min: '$scheduledAt' },
          lastSession: { $max: '$scheduledAt' }
        }
      },
      { $sort: { lastSession: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          avatarUrl: '$user.avatarUrl',
          sessionsCount: 1,
          completedCount: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          skills: 1,
          firstSession: 1,
          lastSession: 1
        }
      }
    ]);

    const search = (q || '').trim().toLowerCase();
    const filtered = search
      ? rows.filter((r) => r.name?.toLowerCase().includes(search) || r.email?.toLowerCase().includes(search))
      : rows;

    res.json({ count: filtered.length, students: filtered });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/mentor/analytics?months=6  (protected)
// Time-series + per-course numbers for the Mentor Analytics page: monthly
// enrollments/revenue over the trailing window, and a per-course rollup
// (enrollments, revenue, rating) so mentors can see which courses are
// carrying the business, not just an aggregate total.
export async function getMentorAnalytics(req, res, next) {
  try {
    const mentorUser = req.user._id;
    const months = Math.min(Math.max(Number(req.query.months) || 6, 1), 24);

    const since = new Date();
    since.setMonth(since.getMonth() - (months - 1));
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.aggregate([
      { $match: { mentorUser, status: { $ne: 'cancelled' }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          enrollments: { $sum: 1 },
          revenue: { $sum: { $cond: ['$paid', '$price', 0] } }
        }
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } }
    ]);

    // Fill in months with zero activity so the chart has a continuous axis.
    const monthly = [];
    const cursor = new Date(since);
    for (let i = 0; i < months; i++) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const found = monthlyBookings.find((b) => b._id.y === y && b._id.m === m);
      monthly.push({
        label: cursor.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
        enrollments: found ? found.enrollments : 0,
        revenue: found ? +found.revenue.toFixed(2) : 0
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const perCourse = await Booking.aggregate([
      { $match: { mentorUser, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$skillId',
          skillTitle: { $first: '$skillTitle' },
          enrollments: { $sum: 1 },
          revenue: { $sum: { $cond: ['$paid', '$price', 0] } },
          students: { $addToSet: '$user' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const ratingBySkill = await Review.aggregate([
      { $match: { mentorUser } },
      { $group: { _id: '$skillId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const ratingMap = Object.fromEntries(ratingBySkill.map((r) => [r._id, { avg: Math.round(r.avg * 10) / 10, count: r.count }]));

    const monthlyRatings = await Review.aggregate([
      { $match: { mentorUser, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          avg: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } }
    ]);
    const ratingCursor = new Date(since);
    const ratingTrend = [];
    for (let i = 0; i < months; i++) {
      const y = ratingCursor.getFullYear();
      const m = ratingCursor.getMonth() + 1;
      const found = monthlyRatings.find((r) => r._id.y === y && r._id.m === m);
      ratingTrend.push({
        label: ratingCursor.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
        avgRating: found ? Math.round(found.avg * 10) / 10 : null,
        count: found ? found.count : 0
      });
      ratingCursor.setMonth(ratingCursor.getMonth() + 1);
    }

    res.json({
      monthly,
      ratingTrend,
      courses: perCourse.map((c) => ({
        skillId: c._id,
        skillTitle: c.skillTitle,
        enrollments: c.enrollments,
        revenue: +c.revenue.toFixed(2),
        studentsCount: c.students.length,
        avgRating: ratingMap[c._id]?.avg || 0,
        reviewsCount: ratingMap[c._id]?.count || 0
      }))
    });
  } catch (err) {
    next(err);
  }
}

// --- Real Razorpay flow for paid ("card") session checkout, mirroring the
// wallet top-up flow in paymentsController.js. Wallet-method checkout stays
// on POST /api/bookings/checkout above (no external gateway needed since
// the balance is already ours). A booking has more fields than a wallet
// top-up (skill, schedule, session type) that all need to survive the round
// trip to Razorpay and back, so they're carried in the order's `notes` —
// then re-validated against the DB before a booking is ever created from
// them, never trusted as-is.

// POST /api/bookings/checkout/razorpay/create-order
// { skillId, scheduledAt, durationMinutes?, notes?, sessionType, price }
export async function createBookingOrder(req, res, next) {
  try {
    const { skillId, scheduledAt, durationMinutes, notes, sessionType, price } = req.body;
    const when = new Date(scheduledAt);

    const skill = await Skill.findOne({ id: skillId });
    if (!skill) {
      return res.status(404).json({ message: `No skill found with id "${skillId}"` });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(price * 100),
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        purpose: 'session_booking',
        skillId,
        scheduledAt: when.toISOString(),
        durationMinutes: String(durationMinutes || 45),
        notes: notes || '',
        sessionType,
        price: String(price)
      }
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay booking order creation failed:', err);
    res.status(500).json({ message: 'Could not start payment. Please try again.' });
  }
}

// POST /api/bookings/checkout/razorpay/verify
// { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Only ever trusts: (a) a signature we recompute ourselves, (b) the paid
// amount as fetched back from Razorpay, and (c) the order's own notes for
// what was actually being booked — never anything resent by the client.
export async function verifyBookingPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!verifyOrderPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, process.env.RAZORPAY_KEY_SECRET)) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    // Idempotency — a retried/double-clicked verify call for a payment
    // that already produced a booking just returns it instead of creating
    // a duplicate (mirrors creditWalletForPayment in paymentsController.js).
    const existingTx = await Transaction.findOne({ providerPaymentId: razorpay_payment_id });
    if (existingTx && existingTx.booking) {
      const booking = await Booking.findById(existingTx.booking);
      return res.json({ booking });
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const orderNotes = order.notes || {};
    if (orderNotes.purpose !== 'session_booking' || orderNotes.userId !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Order does not match this booking request.' });
    }

    const skill = await Skill.findOne({ id: orderNotes.skillId });
    if (!skill) {
      return res.status(404).json({ message: `No skill found with id "${orderNotes.skillId}"` });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const price = payment.amount / 100;

    const session = await mongoose.startSession();
    let booking;
    try {
      await session.withTransaction(async () => {
        const [created] = await Booking.create(
          [
            {
              user: req.user._id,
              skillId: skill.id,
              skillTitle: skill.title,
              mentorName: skill.mentor.name,
              mentorInitials: skill.mentor.initials,
              mentorUser: skill.mentorUser || null,
              scheduledAt: new Date(orderNotes.scheduledAt),
              durationMinutes: Number(orderNotes.durationMinutes) || 45,
              notes: orderNotes.notes || '',
              sessionType: orderNotes.sessionType,
              price,
              paid: true,
              paymentMethod: 'card'
            }
          ],
          { session }
        );
        booking = created;

        await Transaction.create(
          [
            {
              user: req.user._id,
              type: 'session_payment',
              amount: -price,
              method: 'razorpay',
              description: `${orderNotes.sessionType} session booking`,
              booking: booking._id,
              providerOrderId: razorpay_order_id,
              providerPaymentId: razorpay_payment_id
            }
          ],
          { session }
        );
      });
    } finally {
      session.endSession();
    }

    await notifyUser({
      user: req.user._id,
      type: 'booking',
      text: `Your ${orderNotes.sessionType} session is booked for ${new Date(orderNotes.scheduledAt).toLocaleDateString()}.`
    });

    res.status(201).json({ booking });
  } catch (err) {
    if (err.code === 11000) {
      // Race: two concurrent verifies for the same payment — the loser
      // just reports what the winner created instead of erroring out.
      const tx = await Transaction.findOne({ providerPaymentId: req.body.razorpay_payment_id });
      if (tx && tx.booking) {
        const booking = await Booking.findById(tx.booking);
        return res.json({ booking });
      }
    }
    console.error('Razorpay booking verification failed:', err);
    res.status(500).json({ message: 'Could not verify payment.' });
  }
}
