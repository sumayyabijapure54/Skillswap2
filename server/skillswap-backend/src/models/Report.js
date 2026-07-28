import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['message', 'skill_post', 'review', 'community_post', 'user'], required: true },

    // Free-form: a Message id, Skill slug, Review id, CommunityPost id, or
    // User id, depending on `type`. Not resolved/validated against those
    // collections — a report should still be filable even if the
    // underlying content gets deleted before a moderator looks at it.
    targetId: { type: String, default: null },

    // Denormalized display name — matches the admin UI's `reportedUser`
    // field directly (see toJSON below), e.g. "Yuki Hara" or "Unknown poster".
    reportedUserName: { type: String, required: true, trim: true },

    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' }
  },
  { timestamps: true }
);

// listReports filters by status and sorts newest-first.
ReportSchema.index({ status: 1, createdAt: -1 });

ReportSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    ret.reportedUser = ret.reportedUserName;
    delete ret._id;
    delete ret.__v;
    delete ret.reporter;
    delete ret.reportedUserName;
    return ret;
  }
});

export default mongoose.model('Report', ReportSchema);
