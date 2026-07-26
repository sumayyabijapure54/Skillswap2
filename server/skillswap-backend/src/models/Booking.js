import mongoose from 'mongoose';

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: String, required: true }, // slug, matches Skill.id

    // Denormalized at booking time so a session still reads correctly even
    // if the skill's mentor info changes later.
    skillTitle: { type: String, required: true },
    mentorName: { type: String, required: true },
    mentorInitials: { type: String, required: true },

    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 45 },
    notes: { type: String, default: '', trim: true },

    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' }
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1, scheduledAt: 1 });

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
    return ret;
  }
});

export default mongoose.model('Booking', BookingSchema);
