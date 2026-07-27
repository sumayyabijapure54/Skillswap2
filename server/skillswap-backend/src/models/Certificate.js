import mongoose from 'mongoose';

const { Schema } = mongoose;

const CertificateSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skillId: { type: String, required: true }, // slug, matches Skill.id

    // Denormalized at issue time, same pattern as Booking/Review, so the
    // certificate still reads correctly even if the skill/mentor changes later.
    skillTitle: { type: String, required: true },
    mentorName: { type: String, required: true },
    holderName: { type: String, required: true },

    certificateNumber: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

// One certificate per user per skill — re-issuing just returns the existing
// one. Also covers listMyCertificates's user filter; a separate compound
// index adds the createdAt sort on top.
CertificateSchema.index({ user: 1, skillId: 1 }, { unique: true });
CertificateSchema.index({ user: 1, createdAt: -1 });

CertificateSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    ret.issuedAt = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('Certificate', CertificateSchema);
