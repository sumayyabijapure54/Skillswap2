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
    // read server-side while grading (see quizService.gradeAndRecordAttempt)
    // or to the owning mentor while editing/previewing.
    correctOptionId: { type: String, required: true },
    explanation: { type: String, default: '', trim: true }
  },
  { _id: false }
);

// One quiz document per course (skillId), authored entirely by that
// course's mentor — there is no AI generation involved. `published`
// gates both learner visibility (GET /api/quiz/:skillId) and certificate
// eligibility (see certificatesController.issueIfEarned): a draft in
// progress must never block a learner who's already finished every lesson.
const QuizSchema = new Schema(
  {
    skillId: { type: String, required: true, unique: true, index: true, trim: true },
    // The mentor who created/owns this quiz. Kept distinct from
    // Skill.mentorUser (the course's own ownership field, which is what
    // access-control checks actually use) purely as an audit trail —
    // a course could in principle change hands, and this stays a record
    // of who actually wrote these questions.
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questions: { type: [QuizQuestionSchema], default: [] },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    published: { type: Boolean, default: false, index: true },
    // Denormalized purely so list/summary views don't need to load the
    // full questions array just to show a count — kept in sync
    // automatically on every save (see pre-save hook below) rather than
    // trusted from controller input.
    questionCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

QuizSchema.pre('save', function syncQuestionCount(next) {
  this.questionCount = this.questions.length;
  next();
});

QuizSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Quiz', QuizSchema);
