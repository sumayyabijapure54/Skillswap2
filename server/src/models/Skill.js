import mongoose from 'mongoose';

const { Schema } = mongoose;

const MentorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    initials: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviews: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Video', 'Quiz'] }
  },
  { _id: false }
);

const SkillSchema = new Schema(
  {
    // human-readable slug used in URLs, e.g. /skill/react-fundamentals
    id: { type: String, required: true, unique: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['programming', 'design', 'languages', 'business', 'music', 'photography', 'cooking', 'fitness'],
      index: true
    },
    level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'], index: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    students: { type: Number, required: true, min: 0, default: 0 },
    duration: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    mentor: { type: MentorSchema, required: true },
    // If set, this skill's mentor is a real registered user (see
    // /api/skills/:id/claim). `mentor` above stays as a denormalized
    // snapshot for display so nothing else has to change when it's null.
    mentorUser: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    prerequisites: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    lessons: { type: [LessonSchema], default: [] }
  },
  { timestamps: true }
);

// Text index powers the `q` search param (title + tags)
SkillSchema.index({ title: 'text', tags: 'text', description: 'text' });

// Expose `id` in place of Mongo's `_id`/`__v` on the JSON the frontend consumes
SkillSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Skill', SkillSchema);
