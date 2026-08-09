import mongoose from 'mongoose';

const { Schema } = mongoose;

// Deliberately minimal — this backs the footer's "Stay Updated" signup
// form, which is public (no auth) and asks for nothing but an email.
const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true }
  },
  { timestamps: true }
);

NewsletterSubscriberSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
