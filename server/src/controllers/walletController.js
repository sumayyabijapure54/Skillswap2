import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';

// Mirrors Transaction's toJSON transform for .lean() results.
function leanTransaction(t) {
  const { _id, __v, user, ...rest } = t;
  return { id: _id, ...rest };
}

// GET /api/wallet  (protected)
export async function getWallet(req, res, next) {
  try {
    res.json({ wallet: { balance: req.user.wallet.balance } });
  } catch (err) {
    next(err);
  }
}

// GET /api/wallet/transactions?page=&limit=  (protected)
// Full ledger, newest first — powers both the Wallet page's "recent
// activity" preview and the full Payment History page (the frontend can
// filter this list client-side by `type`, same as PaymentHistory.jsx does
// against the mock `transactions` array today).
export async function listTransactions(req, res, next) {
  try {
    const filter = { user: req.user._id };
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 30 });

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(filter)
    ]);

    res.json({ transactions: transactions.map(leanTransaction), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// POST /api/wallet/topup  { amount, method? }  (protected)
// Card top-ups only for now — there's no "top up from wallet" concept.
export async function topUpWallet(req, res, next) {
  try {
    const { amount, method } = req.body;

    const user = await User.findById(req.user._id);
    user.wallet.balance = +(user.wallet.balance + amount).toFixed(2);
    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: 'topup',
      amount,
      method: method || 'card',
      description: 'Wallet top-up'
    });

    res.status(201).json({ wallet: { balance: user.wallet.balance }, transaction });
  } catch (err) {
    next(err);
  }
}
