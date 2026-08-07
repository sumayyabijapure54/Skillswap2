import mongoose from 'mongoose';

const { Schema } = mongoose;

const QuizOptionSchema = new Schema(
  {
    id: { type: String, required: true }, // stable per-question id, e.g. "o1"
    text: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema(
  {
    id: { type: String, required: true }, // stable per-quiz id, e.g. "q1"
    question: { type: String, required: true, trim: true },
    options: {
      type: [QuizOptionSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4,
        message: 'Every question needs exactly 4 options'
      }
    },
    // References an id in `options` above — never sent to students, only
    // read server-side while grading (see aiQuizService.gradeAttempt).
    correctOptionId: { type: String, required: true },
    explanation: { type: String, default: '', trim: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    // slug, matches Skill.id — one AI quiz per course, regenerated in place
    // rather than versioned, so there's always exactly one "current" quiz.
    skillId: { type: String, required: true, unique: true, index: true, trim: true },
    generatedBy: { type: String, default: 'AI' },
    questions: { type: [QuizQuestionSchema], default: [] },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },

    // Which YouTube video (if any) and description/title hash the quiz was
    // built from. Lets us tell a genuinely stale quiz (mentor swapped the
    // video, or edited the description) apart from "just regenerate it
    // because I feel like it" — see aiQuizService.contentFingerprint.
    sourceVideoId: { type: String, default: null },
    contentFingerprint: { type: String, default: null }
  },
  { timestamps: true }
);

QuizSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Quiz', QuizSchema);
