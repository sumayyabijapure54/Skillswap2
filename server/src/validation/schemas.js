import { z } from 'zod';

// --- auth ---

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(100),
  email: z.string().trim().toLowerCase().email('must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72)
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('must be a valid email'),
  password: z.string().min(1, 'password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('must be a valid email')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72)
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required')
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional()
});

// --- users ---

// All fields optional (PATCH — partial update), but constrained/typed when
// present. Previously this endpoint had no schema at all — the controller's
// manual PROFILE_FIELDS allow-list kept out unexpected keys, but let through
// anything of any length/type for the keys it did allow (e.g. an
// arbitrarily long bio, or a non-URL/non-relative-path avatar string).
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'name cannot be empty').max(100).optional(),
  email: z.string().trim().toLowerCase().email('must be a valid email').max(190).optional(),
  bio: z.string().trim().max(500, 'bio must be 500 characters or fewer').optional(),
  avatar: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === '' || /^https?:\/\//i.test(v) || v.startsWith('/uploads/'),
      'avatar must be an http(s) URL, an /uploads/ path, or empty'
    )
    .optional(),
  skillsOffered: z.array(z.string().trim().min(1).max(60)).max(20, 'skillsOffered can have at most 20 entries').optional(),
  skillsWanted: z.array(z.string().trim().min(1).max(60)).max(20, 'skillsWanted can have at most 20 entries').optional()
});

export const completeOnboardingSchema = z.object({
  role: z.enum(['learn', 'teach', 'both'], { errorMap: () => ({ message: "role must be 'learn', 'teach', or 'both'" }) }),
  interests: z.array(z.string().trim().min(1).max(60)).max(20, 'interests can have at most 20 entries').optional(),
  goal: z.enum(['casual', 'regular', 'intense']).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'currentPassword is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(72)
});

// --- bookings ---

export const createBookingSchema = z.object({
  skillId: z.string().trim().min(1, 'skillId is required'),
  scheduledAt: z.coerce
    .date({ invalid_type_error: 'scheduledAt must be a valid date' })
    .refine((d) => d.getTime() > Date.now(), 'scheduledAt must be in the future'),
  durationMinutes: z.coerce.number().int().positive().max(480).optional(),
  notes: z.string().max(1000).optional()
});

export const checkoutBookingSchema = z.object({
  skillId: z.string().trim().min(1, 'skillId is required'),
  scheduledAt: z.coerce
    .date({ invalid_type_error: 'scheduledAt must be a valid date' })
    .refine((d) => d.getTime() > Date.now(), 'scheduledAt must be in the future'),
  durationMinutes: z.coerce.number().int().positive().max(480).optional(),
  notes: z.string().max(1000).optional(),
  sessionType: z.string().trim().min(1, 'sessionType is required').max(100),
  price: z.coerce.number().min(0, 'price must be 0 or more'),
  method: z.enum(['card', 'wallet'], { errorMap: () => ({ message: "method must be 'card' or 'wallet'" }) })
});

export const createBookingOrderSchema = z.object({
  skillId: z.string().trim().min(1, 'skillId is required'),
  scheduledAt: z.coerce
    .date({ invalid_type_error: 'scheduledAt must be a valid date' })
    .refine((d) => d.getTime() > Date.now(), 'scheduledAt must be in the future'),
  durationMinutes: z.coerce.number().int().positive().max(480).optional(),
  notes: z.string().max(1000).optional(),
  sessionType: z.string().trim().min(1, 'sessionType is required').max(100),
  price: z.coerce.number().positive('price must be greater than 0')
});

export const updateBookingNotesSchema = z.object({
  notes: z.string().max(1000).optional()
});

// --- wallet ---

export const topUpSchema = z.object({
  amount: z.coerce.number().positive('amount must be greater than 0').max(100000),
  method: z.literal('card').optional().default('card')
});

// --- payments (Razorpay) ---

export const createRazorpayOrderSchema = z.object({
  amount: z.coerce.number().positive('amount must be greater than 0').max(50000)
});

export const verifyRazorpayPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1)
});

// --- reviews ---

export const createReviewSchema = z.object({
  bookingId: z.string().trim().min(1, 'bookingId is required'),
  rating: z.coerce.number().min(1, 'rating must be between 1 and 5').max(5, 'rating must be between 1 and 5'),
  comment: z.string().max(1000).optional()
});

// --- messages ---

export const sendMessageSchema = z.object({
  text: z.string().trim().min(1, 'text is required').max(2000)
});

// --- community ---

export const createPostSchema = z.object({
  text: z.string().trim().min(1, 'text is required').max(2000),
  tags: z.array(z.string().trim().min(1)).max(10).optional(),
  type: z.enum(['offer', 'request']).optional(),
  category: z.string().trim().max(50).optional(),
  title: z.string().trim().max(200).optional()
});

export const addCommentSchema = z.object({
  text: z.string().trim().min(1, 'text is required').max(500)
});

// --- skills ---

const lessonChapterSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  startSeconds: z.coerce.number().min(0),
  endSeconds: z.coerce.number().min(0),
  duration: z.string().trim().optional()
});

// The mentor-provided YouTube video for one lesson — resolved server-side
// via GET /api/youtube/video before the mentor ever submits the course
// form, so everything here describes a real video the mentor explicitly
// chose. Required on every `type: 'Video'` lesson.
const lessonYoutubeSchema = z.object({
  videoId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  url: z.string().trim().min(1),
  embedUrl: z.string().trim().min(1),
  thumbnail: z.string().trim().optional(),
  channelTitle: z.string().trim().optional(),
  duration: z.string().trim().optional(),
  durationSeconds: z.coerce.number().optional(),
  chapters: z.array(lessonChapterSchema).max(50).optional()
});

const lessonSchema = z.object({
  title: z.string().trim().min(1, 'lesson title is required'),
  description: z.string().trim().max(2000).optional(),
  order: z.coerce.number().optional(),
  duration: z.string().max(50).optional(),
  type: z.enum(['Video', 'Quiz']).optional(),
  youtube: lessonYoutubeSchema.optional(),
  quiz: z.array(z.object({
    q: z.string().trim().min(1),
    options: z.array(z.string().trim().min(1)).min(2),
    correct: z.coerce.number().min(0)
  })).optional()
}).refine(
  (lesson) => lesson.type === 'Quiz' || Boolean(lesson.youtube),
  { message: 'Every video lesson needs a YouTube URL — paste one and fetch it before saving.', path: ['youtube'] }
);

export const createSkillSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(150),
  category: z.string().trim().min(1, 'category is required'),
  level: z.string().trim().min(1, 'level is required'),
  description: z.string().trim().min(1, 'description is required').max(3000),
  duration: z.string().max(50).optional(),
  mentorRole: z.string().max(100).optional(),
  prerequisites: z.array(z.string().trim().min(1)).max(20).optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  lessons: z.array(lessonSchema).max(100).optional()
});

export const updateSkillSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().min(1).max(3000).optional(),
  duration: z.string().max(50).optional(),
  prerequisites: z.array(z.string().trim().min(1)).max(20).optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  lessons: z.array(lessonSchema).max(100).optional()
});

// --- mentor applications ---

export const submitMentorApplicationSchema = z.object({
  skillTitle: z.string().trim().min(1, 'skillTitle is required').max(150),
  category: z.string().trim().min(1, 'category is required'),
  bio: z.string().trim().min(1, 'bio is required').max(1000)
});

// --- progress ---

export const recordQuizScoreSchema = z.object({
  score: z.coerce.number().min(0, 'score must be 0 or more'),
  total: z.coerce.number().positive('total must be greater than 0')
}).refine((d) => d.score <= d.total, { message: 'score cannot exceed total', path: ['score'] });

// --- AI course quiz ---

const quizAnswerSchema = z.object({
  questionId: z.string().trim().min(1).max(50),
  selectedOptionId: z.string().trim().min(1).max(50).nullable().optional()
});

export const submitQuizSchema = z.object({
  answers: z.array(quizAnswerSchema).max(30, 'Too many answers submitted').default([])
});

// --- mentor-authored quiz management ---

const quizQuestionInputSchema = z.object({
  question: z.string().trim().min(1, 'Question text is required').max(1000),
  options: z.array(z.string().trim().min(1, 'Option text is required').max(300)).length(4, 'Exactly 4 options are required'),
  correctOptionIndex: z.number().int().min(0).max(3),
  explanation: z.string().trim().max(1000).optional().default('')
});

export const saveQuizSchema = z.object({
  questions: z.array(quizQuestionInputSchema).max(50, 'A quiz can have at most 50 questions').default([]),
  passingScore: z.number().int().min(0).max(100).optional()
});

export const publishQuizSchema = z.object({
  published: z.boolean()
});

// --- reports ---

export const createReportSchema = z.object({
  type: z.enum(['message', 'skill_post', 'review', 'community_post', 'user'], {
    errorMap: () => ({ message: 'type must be one of: message, skill_post, review, community_post, user' })
  }),
  targetId: z.string().trim().max(200).optional(),
  reportedUserName: z.string().trim().min(1, 'reportedUserName is required').max(150),
  reason: z.string().trim().min(1, 'reason is required').max(1000)
});

// --- AI Mentor chatbot ---

// Loose on purpose — this rides along as extra grounding for the system
// prompt (current lesson/skill/code/error the learner is looking at), not
// data that's persisted or trusted for anything security-sensitive.
const chatContextSchema = z.object({
  skillId: z.string().trim().max(150).optional(),
  skillTitle: z.string().trim().max(200).optional(),
  lessonTitle: z.string().trim().max(200).optional(),
  lessonTranscript: z.string().trim().max(8000).optional(),
  codeSnippet: z.string().trim().max(6000).optional(),
  errorMessage: z.string().trim().max(2000).optional()
}).optional().nullable();

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'message is required').max(4000),
  context: chatContextSchema
});

export const chatQuickActionSchema = z.object({
  type: z.enum(['quiz', 'flashcards', 'summary', 'study-plan', 'hint'], {
    errorMap: () => ({ message: 'type must be one of: quiz, flashcards, summary, study-plan, hint' })
  }),
  context: chatContextSchema
});

// --- live sessions ---

export const createLiveSessionSchema = z.object({
  skillId: z.string().trim().min(1, 'skillId is required'),
  title: z.string().trim().min(1, 'title is required').max(200),
  description: z.string().trim().max(2000).optional(),
  startTime: z.coerce
    .date({ invalid_type_error: 'startTime must be a valid date' })
    .refine((d) => d.getTime() > Date.now(), 'startTime must be in the future'),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  timezone: z.string().trim().max(100).optional(),
  meetingProvider: z.enum(['jitsi', 'zoom', 'google-meet', 'custom']).optional(),
  meetingUrl: z.string().trim().url('meetingUrl must be a valid URL').max(2000).optional().or(z.literal('')),
  maxParticipants: z.coerce.number().int().positive().max(10000).optional()
});

export const updateLiveSessionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  startTime: z.coerce.date({ invalid_type_error: 'startTime must be a valid date' }).optional(),
  durationMinutes: z.coerce.number().int().min(5).max(480).optional(),
  timezone: z.string().trim().max(100).optional(),
  meetingProvider: z.enum(['jitsi', 'zoom', 'google-meet', 'custom']).optional(),
  meetingUrl: z.string().trim().url('meetingUrl must be a valid URL').max(2000).optional().or(z.literal('')),
  maxParticipants: z.coerce.number().int().positive().max(10000).optional()
});

export const endLiveSessionSchema = z.object({
  recordingUrl: z.string().trim().url('recordingUrl must be a valid URL').max(2000).optional().or(z.literal(''))
});

export const attachRecordingSchema = z.object({
  recordingUrl: z.string().trim().url('recordingUrl must be a valid URL').max(2000)
});

// --- newsletter ---

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('must be a valid email')
});
