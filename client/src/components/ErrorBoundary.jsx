import React from 'react';

// Catches render-time errors anywhere below it in the tree. Without this,
// a throw in any page component unmounts the whole React tree and leaves
// a blank white screen — no nav, no way back, no clue what happened.
// Route-level placement (see App.jsx) means one page crashing doesn't take
// the navbar/footer down with it, and switching routes gives the user an
// easy way out without a full reload.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] caught:', error, info?.componentStack);
    }
  }

  componentDidUpdate(prevProps) {
    // Reset automatically on navigation so the boundary doesn't keep
    // showing the fallback for a route that had nothing to do with the
    // error (e.g. crash on /wallet, user clicks Home — Home should render).
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 24px',
          gap: 14
        }}>
          <div style={{ fontSize: 42 }}>⚠️</div>
          <h2 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 420, margin: 0 }}>
            This page hit an unexpected error. You can try reloading, or head back to the homepage.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn-outline" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a className="btn-solid" href="/">Go home</a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
