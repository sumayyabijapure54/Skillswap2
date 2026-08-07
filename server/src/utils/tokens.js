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

// Same shape as generateResetToken (raw sent to the client, hash stored in
// the DB) — reused for refresh tokens since the security requirement is
// identical: a DB leak alone shouldn't be enough to impersonate a session.
export function generateRefreshToken() {
  const rawToken = crypto.randomBytes(40).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
}

// Human-readable & easy to read aloud/type: SS-<year>-<6 digit number>,
// e.g. SS-2026-004821. Still has ~900k possible values per year, and the
// caller (issueIfEarned) retries on the rare collision against the unique
// index, so this doesn't need to be a DB-backed sequence to stay safe.
export function generateCertificateNumber(date = new Date()) {
  const year = date.getFullYear();
  const serial = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  return `SS-${year}-${serial}`;
}
