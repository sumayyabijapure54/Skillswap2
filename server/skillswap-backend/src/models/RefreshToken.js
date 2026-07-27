import mongoose from 'mongoose';

const { Schema } = mongoose;

const RefreshTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Only the sha256 hash is stored — same reasoning as password reset
    // tokens: a DB leak alone shouldn't be enough to hijack a session.
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// TTL index — MongoDB automatically deletes a token once its expiresAt
// passes, so expired sessions don't just pile up in the collection.
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('RefreshToken', RefreshTokenSchema);
