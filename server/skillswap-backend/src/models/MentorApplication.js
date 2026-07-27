import mongoose from 'mongoose';

const { Schema } = mongoose;

const MentorApplicationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // Denormalized at submission time, same pattern as everywhere else in
    // this API — an application still reads correctly even if the
    // applicant later renames or changes their email.
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },

    skillTitle: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true, maxlength: 1000 },

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// listMentorApplications filters by status and sorts newest-first.
MentorApplicationSchema.index({ status: 1, createdAt: -1 });

MentorApplicationSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    // Field names matched to what the admin UI already expects
    // (AdminMentorApplications.jsx reads `.skill` and `.submittedAt`).
    ret.skill = ret.skillTitle;
    ret.submittedAt = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    delete ret.skillTitle;
    return ret;
  }
});

export default mongoose.model('MentorApplication', MentorApplicationSchema);
