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

const lessonSchema = z.object({
  title: z.string().trim().min(1, 'lesson title is required'),
  duration: z.string().max(50).optional(),
  type: z.enum(['Video', 'Quiz']).optional()
});

const youtubeVideoSchema = z.object({
  videoId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  url: z.string().trim().min(1),
  embedUrl: z.string().trim().min(1),
  thumbnail: z.string().trim().optional(),
  channelTitle: z.string().trim().optional(),
  duration: z.string().trim().optional(),
  durationSeconds: z.coerce.number().optional()
}).nullable();

export const createSkillSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(150),
  category: z.string().trim().min(1, 'category is required'),
  level: z.string().trim().min(1, 'level is required'),
  description: z.string().trim().min(1, 'description is required').max(3000),
  duration: z.string().max(50).optional(),
  mentorRole: z.string().max(100).optional(),
  prerequisites: z.array(z.string().trim().min(1)).max(20).optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  lessons: z.array(lessonSchema).max(100).optional(),
  youtubeVideo: youtubeVideoSchema.optional()
});

export const updateSkillSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().min(1).max(3000).optional(),
  duration: z.string().max(50).optional(),
  prerequisites: z.array(z.string().trim().min(1)).max(20).optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  lessons: z.array(lessonSchema).max(100).optional(),
  youtubeVideo: youtubeVideoSchema.optional()
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
