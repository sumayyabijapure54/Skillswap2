import mongoose from 'mongoose';

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: String, required: true }, // slug, matches Skill.id

    // Denormalized at booking time so a session still reads correctly even
    // if the skill's mentor info changes later. mentorUser is a snapshot
    // too — if the mentor later unclaims the skill, this booking should
    // stay theirs, not silently transfer to whoever claims it next. It
    // also lets listMentorBookings query directly instead of first looking
    // up which skills the mentor owns.
    skillTitle: { type: String, required: true },
    mentorName: { type: String, required: true },
    mentorInitials: { type: String, required: true },
    mentorUser: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },

    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 45 },
    notes: { type: String, default: '', trim: true },
    sessionType: { type: String, default: '', trim: true },

    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },

    // Payment (set by POST /api/bookings/checkout — plain POST /api/bookings
    // still creates a free/unpaid booking for skills with no session price).
    price: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['card', 'wallet', null], default: null }
  },
  { timestamps: true }
);

// Covers listBookings (learner) and listMentorBookings, both of which
// filter on status and sort/range on scheduledAt.
BookingSchema.index({ user: 1, status: 1, scheduledAt: 1 });
BookingSchema.index({ mentorUser: 1, status: 1, scheduledAt: 1 });

BookingSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // If .populate('user', ...) was used (mentor-side views), surface it as
    // `learner` instead of the raw ref; otherwise strip it.
    if (ret.user && typeof ret.user === 'object' && ret.user.name) {
      ret.learner = { id: ret.user._id, name: ret.user.name, email: ret.user.email };
    }
    delete ret.user;
    delete ret.mentorUser;
    return ret;
  }
});

export default mongoose.model('Booking', BookingSchema);
