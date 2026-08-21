import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    // Not required for social-login accounts (Google/Facebook) — those
    // users authenticate via the provider and never set a local password
    // unless they later use "forgot password" to add one.
    password: {
      type: String,
      required: function passwordRequired() { return !this.googleId && !this.facebookId; },
      minlength: 8,
      select: false
    },

    // Social login — a user can have arrived via email/password, Google,
    // Facebook, or (having started one way) linked another later, so these
    // are independent optional fields rather than a single "provider" enum.
    googleId: { type: String, select: false, index: true, sparse: true },
    facebookId: { type: String, select: false, index: true, sparse: true },
    authProviders: { type: [String], default: ['password'] },

    // Email verification (OTP). Social logins arrive pre-verified since the
    // provider already confirmed the email address.
    verified: { type: Boolean, default: false },
    emailVerifyOTP: { type: String, select: false },
    emailVerifyExpires: { type: Date, select: false },

    // Password reset
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // Onboarding + profile
    onboarded: { type: Boolean, default: false },
    role: { type: String, enum: ['learn', 'teach', 'both', null], default: null },
    interests: { type: [String], default: [] },
    goal: { type: String, enum: ['casual', 'regular', 'intense', null], default: null },
    bio: { type: String, default: '', trim: true },
    avatar: { type: String, default: '' },
    skillsOffered: { type: [String], default: [] },
    skillsWanted: { type: [String], default: [] },

    // Saved skills (Wishlist page)
    wishlist: { type: [String], default: [] },

    // Platform administration — deliberately separate from the onboarding
    // `role` above (learn/teach/both is "what this person does on
    // SkillSwap"; isAdmin is "can this person moderate SkillSwap").
    isAdmin: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },

    // Admin-controlled "Top Mentors" homepage section (replaces the old
    // automatic rating-based selection — see topMentorsController.js).
    // Only meaningful for users who actually mentor (have a Skill with
    // mentorUser === this user), but harmless to leave default/false on
    // every other account, same as isAdmin above.
    isTopMentor: { type: Boolean, default: false },
    // 1-based display position among featured mentors; null while not
    // featured. Only unique/meaningful among isTopMentor:true users —
    // enforced in the controller, not at the schema level.
    topMentorOrder: { type: Number, default: null },

    // Wallet balance in whole currency units (dollars). Every new account
    // starts with a $50 welcome credit, matching the frontend mock's seed
    // state — see Transaction for the ledger of how the balance got here.
    wallet: {
      _id: false,
      balance: { type: Number, default: 50, min: 0 }
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

// Never expose sensitive/internal fields, even if a route forgets to .select() them out
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.emailVerifyOTP;
    delete ret.emailVerifyExpires;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.googleId;
    delete ret.facebookId;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('User', UserSchema);
