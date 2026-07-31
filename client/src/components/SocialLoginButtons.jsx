import React from 'react';
import { useUser } from '../context/UserContext.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

// Renders Google's own "Sign in with Google" button into a div (Google
// Identity Services owns the rendering — you can't style the button
// yourself, only pick size/shape/theme) and Facebook's official button.
// Both hand us a token which we forward to the backend for verification —
// see server/src/lib/socialAuth.js and server/src/controllers/authController.js.
export default function SocialLoginButtons({ onResult }) {
  const { logInWithGoogle, logInWithFacebook } = useUser();
  const googleDivRef = React.useRef(null);
  const [fbReady, setFbReady] = React.useState(false);
  const [fbLoading, setFbLoading] = React.useState(false);
  const [configError, setConfigError] = React.useState('');

  React.useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadScript('https://accounts.google.com/gsi/client', 'google-identity-sdk')
      .then(() => {
        if (cancelled || !window.google || !googleDivRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            const res = await logInWithGoogle(response.credential);
            onResult?.(res);
          }
        });
        window.google.accounts.id.renderButton(googleDivRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 260,
          text: 'continue_with'
        });
      })
      .catch(() => setConfigError('Could not load Google Sign-In.'));

    return () => { cancelled = true; };
  }, [logInWithGoogle, onResult]);

  React.useEffect(() => {
    if (!FACEBOOK_APP_ID) return;
    let cancelled = false;

    loadScript('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk')
      .then(() => {
        if (cancelled) return;
        window.FB?.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v19.0' });
        setFbReady(true);
      })
      .catch(() => setConfigError('Could not load Facebook Login.'));

    return () => { cancelled = true; };
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) return;
    setFbLoading(true);
    window.FB.login(
      async (response) => {
        if (response.authResponse?.accessToken) {
          const res = await logInWithFacebook(response.authResponse.accessToken);
          onResult?.(res);
        } else {
          onResult?.({ ok: false, error: 'Facebook login was cancelled.' });
        }
        setFbLoading(false);
      },
      { scope: 'public_profile,email' }
    );
  };

  if (!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID) {
    // Nothing configured yet — don't show broken buttons. See
    // client/.env.example for VITE_GOOGLE_CLIENT_ID / VITE_FACEBOOK_APP_ID.
    return null;
  }

  return (
    <div className="social-row" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
      {GOOGLE_CLIENT_ID && <div ref={googleDivRef} />}
      {FACEBOOK_APP_ID && (
        <button
          type="button"
          className="social-btn"
          onClick={handleFacebookLogin}
          disabled={!fbReady || fbLoading}
        >
          {fbLoading ? 'Connecting…' : 'f Facebook'}
        </button>
      )}
      {configError && <div className="form-error">{configError}</div>}
    </div>
  );
}
