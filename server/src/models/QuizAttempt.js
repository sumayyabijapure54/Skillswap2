import mongoose from 'mongoose';

const { Schema } = mongoose;

const QuizAnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, default: null }, // null = left blank
    correct: { type: Boolean, required: true }
  },
  { _id: false }
);

const QuizAttemptSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: String, required: true, index: true }, // slug, matches Skill.id
    answers: { type: [QuizAnswerSchema], default: [] },
    score: { type: Number, required: true, min: 0 }, // percentage, 0-100
    total: { type: Number, required: true, min: 0 }, // question count
    correctCount: { type: Number, required: true, min: 0 },
    passed: { type: Boolean, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

QuizAttemptSchema.index({ user: 1, skillId: 1, completedAt: -1 });

QuizAttemptSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('QuizAttempt', QuizAttemptSchema);
