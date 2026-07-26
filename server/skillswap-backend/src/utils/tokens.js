import crypto from 'crypto';

export function generateOTP() {
  return String(crypto.randomInt(100000, 1000000)); // 6 digits
}

// Returns { rawToken, hashedToken } — send rawToken in the email link,
// store only hashedToken in the DB so a DB leak can't be used to reset passwords.
export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
}

export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// Human-shareable, still unique enough for a demo: SS-<8 hex chars, upper>.
export function generateCertificateNumber() {
  return `SS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}
