import mongoose from 'mongoose';

const { Schema } = mongoose;

// A single ledger entry for a user's wallet. `amount` is signed — positive
// for money coming in (topup, refund), negative for money going out
// (session_payment) — so a client can just sum/display it directly instead
// of branching on `type`. Mirrors the shape the frontend's mock
// `transactions` array already uses (see UserContext.jsx's payAndBookSession/
// topUpWallet/cancelBooking), so wiring the real API in is mechanical.
const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['topup', 'session_payment', 'refund'], required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['card', 'wallet'], required: true },
    description: { type: String, required: true, trim: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', default: null }
  },
  { timestamps: true }
);

// listTransactions always filters by user and sorts newest-first.
TransactionSchema.index({ user: 1, createdAt: -1 });

TransactionSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('Transaction', TransactionSchema);
