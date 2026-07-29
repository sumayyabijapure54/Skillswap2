import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { CommunityProvider } from './context/CommunityContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

// A hard refresh can restore the browser's previous scroll position before
// React/Lenis/ScrollTrigger have mounted. Lenis then starts its virtual
// scroll from 0 while the native page is already scrolled, and ScrollTrigger
// computes the hero parallax's start/end bounds against that mismatched
// state — the visible symptom being the 3D hero graphic rendering with a
// wrong transform (clipped/offset) until the user scrolls and it recalculates.
// Forcing manual restoration removes that race entirely.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <CommunityProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </CommunityProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
