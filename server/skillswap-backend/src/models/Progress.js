import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: String, required: true }, // slug, matches Skill.id
    completedLessons: { type: [Number], default: [] }, // lesson ids
    enrolledAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ProgressSchema.index({ user: 1, skillId: 1 }, { unique: true });

ProgressSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('Progress', ProgressSchema);
