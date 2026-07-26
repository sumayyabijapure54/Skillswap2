import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';

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
      scheduledAt: when,
      durationMinutes: durationMinutes || 45,
      notes: notes || ''
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings?when=upcoming|past  (protected)
export async function listBookings(req, res, next) {
  try {
    const { when } = req.query;
    const filter = { user: req.user._id, status: { $ne: 'cancelled' } };

    if (when === 'upcoming') filter.scheduledAt = { $gte: new Date() };
    else if (when === 'past') filter.scheduledAt = { $lt: new Date() };

    const sortDir = when === 'past' ? -1 : 1;
    const bookings = await Booking.find(filter).sort({ scheduledAt: sortDir });

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/bookings/:id/cancel  (protected — the learner who booked it)
export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

// GET /api/bookings/mentor?when=upcoming|past  (protected)
// Sessions booked with skills the current user mentors.
export async function listMentorBookings(req, res, next) {
  try {
    const { when } = req.query;

    const mentoredSkillIds = (await Skill.find({ mentorUser: req.user._id }).select('id')).map(s => s.id);
    if (mentoredSkillIds.length === 0) return res.json({ bookings: [] });

    const filter = { skillId: { $in: mentoredSkillIds }, status: { $ne: 'cancelled' } };
    if (when === 'upcoming') filter.scheduledAt = { $gte: new Date() };
    else if (when === 'past') filter.scheduledAt = { $lt: new Date() };

    const sortDir = when === 'past' ? -1 : 1;
    const bookings = await Booking.find(filter).sort({ scheduledAt: sortDir }).populate('user', 'name email');

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

// Shared guard: only the mentor of the booking's skill may act on it as a mentor.
async function findBookingAsMentor(bookingId, mentorUserId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return { error: 404, message: 'Booking not found' };

  const skill = await Skill.findOne({ id: booking.skillId });
  if (!skill || !skill.mentorUser || skill.mentorUser.toString() !== mentorUserId.toString()) {
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
