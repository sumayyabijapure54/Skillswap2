import mongoose from 'mongoose';

const { Schema } = mongoose;

const MentorSchema = new Schema(
  {
    // Slug matching a mentor's id in the client's mentor directory (e.g.
    // 'alex-johnson'). Not required — a skill posted through PostSkill by a
    // real registered user may not have one until mentorUser is set below.
    id: { type: String, trim: true, default: null },
    name: { type: String, required: true, trim: true },
    initials: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviews: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema(
  {
    q: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correct: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Video', 'Quiz'] },
    // Placeholder/sample clip URL — see client/src/data/videoSources.js.
    // Null for lessons that instead rely on the linked YouTube course
    // (see Skill.youtubeVideo below).
    videoUrl: { type: String, default: null, trim: true },
    // Only populated on `type: 'Quiz'` lessons.
    quiz: { type: [QuizQuestionSchema], default: [] }
  },
  { _id: false }
);

const YoutubeVideoSchema = new Schema(
  {
    videoId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    embedUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '', trim: true },
    channelTitle: { type: String, default: '', trim: true },
    duration: { type: String, default: '', trim: true },
    durationSeconds: { type: Number, default: 0 }
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
      enum: [
        'programming', 'ai-ml', 'web-development', 'mobile-development',
        'design', 'graphic-design', 'video-editing', 'marketing',
        'business', 'finance', 'languages', 'music', 'photography',
        'cooking', 'fitness'
      ],
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
    // Placeholder/sample clip — see client/src/data/videoSources.js.
    previewVideoUrl: { type: String, default: null, trim: true },
    lessons: { type: [LessonSchema], default: [] },
    // Set when a mentor uploads a course by pasting a YouTube URL (see
    // POST /api/youtube/video + createSkill/updateSkill). Null for skills
    // with no linked video — the lesson player falls back to the curated
    // getCourseForSkill() search in that case, same as before.
    youtubeVideo: { type: YoutubeVideoSchema, default: null }
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
