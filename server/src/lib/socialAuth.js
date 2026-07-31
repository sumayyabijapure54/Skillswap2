import { OAuth2Client } from 'google-auth-library';

// A single shared client, reused across requests (the library caches
// Google's signing keys internally, so this also avoids re-fetching them
// on every login).
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

// Verifies a Google Identity Services `credential` (a signed JWT the
// front end gets straight from Google — see client/src/lib/googleAuth.js).
// Verifying it here (server-side, against Google's public keys) is what
// makes this trustworthy: the client could otherwise just send us any
// email address it likes.
export async function verifyGoogleToken(credential) {
  if (!googleClient) {
    throw Object.assign(new Error('Google login is not configured on this server (missing GOOGLE_CLIENT_ID)'), { status: 500 });
  }
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw Object.assign(new Error('Google account has no email address'), { status: 400 });
  }
  return {
    providerId: payload.sub,
    email: payload.email,
    emailVerified: !!payload.email_verified,
    name: payload.name || payload.email.split('@')[0],
    avatar: payload.picture || ''
  };
}

// Facebook has no server-side SDK dependency needed — the Graph API is a
// plain HTTPS endpoint. We ask Facebook to resolve the access token the
// client got from the Facebook Login SDK into the profile it belongs to;
// if the token is forged/expired/for a different app, this call fails.
export async function verifyFacebookToken(accessToken) {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    throw Object.assign(new Error('Facebook login is not configured on this server (missing FACEBOOK_APP_ID/SECRET)'), { status: 500 });
  }

  // debug_token confirms the access token was actually issued for *our*
  // app (not a token minted for some other app that happens to be valid).
  const appToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
  const debugRes = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appToken)}`
  );
  const debugData = await debugRes.json();
  const debugInfo = debugData?.data;
  if (!debugInfo?.is_valid || debugInfo.app_id !== process.env.FACEBOOK_APP_ID) {
    throw Object.assign(new Error('Invalid Facebook access token'), { status: 401 });
  }

  const profileRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`
  );
  const profile = await profileRes.json();
  if (!profile?.email) {
    throw Object.assign(new Error('Your Facebook account has no email address on file — Facebook login requires one'), { status: 400 });
  }

  return {
    providerId: profile.id,
    email: profile.email,
    emailVerified: true, // Facebook only returns `email` for confirmed addresses
    name: profile.name || profile.email.split('@')[0],
    avatar: profile.picture?.data?.url || ''
  };
}
