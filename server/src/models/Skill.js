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

// A single chapter/segment within a lesson's own YouTube video — either
// real author-provided chapters (parsed from the video description) or
// evenly-split synthetic segments when the video has none. Always belongs
// to exactly the lesson's own video, never a different one.
const LessonChapterSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    startSeconds: { type: Number, required: true, min: 0 },
    endSeconds: { type: Number, required: true, min: 0 },
    duration: { type: String, default: '', trim: true }
  },
  { _id: false }
);

// The mentor-provided YouTube video attached to one lesson. Populated by
// the mentor pasting a URL when building/editing a lesson (see
// POST /api/youtube/video + skillsController.createSkill/updateSkill).
// Required on every `type: 'Video'` lesson — there is no other source for
// a video lesson's content.
const LessonYoutubeSchema = new Schema(
  {
    videoId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    embedUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '', trim: true },
    channelTitle: { type: String, default: '', trim: true },
    duration: { type: String, default: '', trim: true },
    durationSeconds: { type: Number, default: 0 },
    chapters: { type: [LessonChapterSchema], default: [] }
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    // Optional lesson-level notes the mentor can add alongside the video.
    description: { type: String, default: '', trim: true },
    // Explicit ordering set by the mentor when building the course
    // (defaults to `id`'s position — see skillsController.createSkill).
    order: { type: Number, required: true },
    duration: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Video', 'Quiz'] },
    // Legacy placeholder/sample clip URL from courses seeded before the
    // mentor-video-per-lesson flow existed — see
    // client/src/data/videoSources.js. Not settable through the current
    // mentor course form; kept only so pre-existing seeded courses keep
    // playing. New `type: 'Video'` lessons must use `youtube` below instead.
    videoUrl: { type: String, default: null, trim: true },
    // The mentor's own YouTube video for this lesson. Required for any
    // `type: 'Video'` lesson created/edited through the mentor course form.
    // Never auto-searched or auto-selected — see server/src/services/youtubeService.js.
    youtube: { type: LessonYoutubeSchema, default: null },
    // Only populated on `type: 'Quiz'` lessons.
    quiz: { type: [QuizQuestionSchema], default: [] }
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
    // The full curriculum, in order. Every `type: 'Video'` lesson carries
    // its own mentor-provided YouTube video (`lessons[].youtube`) — see
    // LessonSchema above. Students only ever watch what's stored here.
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
