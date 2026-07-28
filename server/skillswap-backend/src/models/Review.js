import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skillId: { type: String, required: true }, // slug, matches Skill.id

    // One review per completed booking — also lets us look up "have I
    // already reviewed this session" without a separate query.
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },

    // Denormalized at creation time, same pattern as Booking, so a review
    // still reads correctly even if the skill/mentor changes later.
    skillTitle: { type: String, required: true },
    mentorName: { type: String, required: true },
    mentorUser: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

// listSkillReviews and listMyReviews both filter on one field and sort by
// createdAt — compound indexes serve the whole query in one pass.
ReviewSchema.index({ skillId: 1, createdAt: -1 });
ReviewSchema.index({ user: 1, createdAt: -1 });

ReviewSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // If .populate('user', ...) was used, surface it as `reviewer` instead
    // of the raw ref; otherwise strip it.
    if (ret.user && typeof ret.user === 'object' && ret.user.name) {
      ret.reviewer = { id: ret.user._id, name: ret.user.name };
    }
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('Review', ReviewSchema);
