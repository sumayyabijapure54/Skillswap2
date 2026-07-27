import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const CommunityPostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Denormalized at post time, same pattern as everywhere else in this
    // API, so a post still reads correctly if the author later renames.
    authorName: { type: String, required: true },
    authorInitials: { type: String, required: true },

    // The frontend's Community Feed / "Post a Skill" flow frames every post
    // as either offering to teach something or asking to learn something,
    // with a short title separate from the longer description (`text`) —
    // these three are optional so the simpler "just post some text" shape
    // still works for any other caller.
    type: { type: String, enum: ['offer', 'request'], default: 'offer' },
    category: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },

    text: { type: String, required: true, trim: true, maxlength: 2000 },
    tags: { type: [String], default: [] },

    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    comments: { type: [CommentSchema], default: [] }
  },
  { timestamps: true }
);

CommunityPostSchema.index({ createdAt: -1 });

// Pass { viewerId } to .toJSON()/.toObject() to get an accurate `likedByMe`
// for the requesting user — e.g. `post.toJSON({ viewerId: req.user._id })`.
CommunityPostSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.user;

    ret.likeCount = doc.likes.length;
    ret.likedByMe = !!(options.viewerId && doc.likes.some((id) => id.equals(options.viewerId)));
    delete ret.likes;

    ret.comments = doc.comments.map((c) => ({
      id: c._id,
      authorName: c.authorName,
      text: c.text,
      createdAt: c.createdAt
    }));

    return ret;
  }
});

export default mongoose.model('CommunityPost', CommunityPostSchema);
