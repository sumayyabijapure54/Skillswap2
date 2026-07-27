import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// getThread queries "from:me,to:them OR from:them,to:me" — one compound
// index per direction covers both branches of that $or.
MessageSchema.index({ from: 1, to: 1, createdAt: 1 });
MessageSchema.index({ to: 1, from: 1, createdAt: 1 });

MessageSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Message', MessageSchema);
