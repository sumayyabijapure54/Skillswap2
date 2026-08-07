import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['booking', 'message', 'recommendation', 'system'], required: true },
    text: { type: String, required: true },
    // Optional client-side route (e.g. `/certificate/python-basics`) so a
    // notification like "you earned a certificate" can jump straight to it.
    link: { type: String, default: null, trim: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// listNotifications always filters by user and sorts by createdAt — a
// compound index serves both parts of that query in one pass.
NotificationSchema.index({ user: 1, createdAt: -1 });

NotificationSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('Notification', NotificationSchema);
