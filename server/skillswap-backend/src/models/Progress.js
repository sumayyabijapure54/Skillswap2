import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: String, required: true }, // slug, matches Skill.id
    completedLessons: { type: [Number], default: [] }, // lesson ids

    // Keyed by lessonId (as a string, since object keys always are) ->
    // { score, total }. Plain Mixed rather than a Map so it serializes to
    // JSON exactly the way the frontend's mock already shapes it —
    // enrolled[i].quizScores[lessonId] = { score, total }.
    quizScores: { type: Schema.Types.Mixed, default: {} },

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
