import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);
let nextId = 1;

// One shared toast queue for the whole app. Anywhere that currently shows
// a one-off inline "Saved!" div, or silently succeeds/fails with no
// feedback, can call useToast() instead and get a consistent corner
// notification with the right tone (success/error/info) and auto-dismiss.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const push = useCallback((message, variant = 'info', duration = 4000) => {
    const id = nextId++;
    setToasts((t) => [...t, { id, message, variant }]);
    const timer = setTimeout(() => dismiss(id), duration);
    timers.current.set(id, timer);
    return id;
  }, [dismiss]);

  const api = React.useMemo(() => ({
    success: (msg, duration) => push(msg, 'success', duration),
    error: (msg, duration) => push(msg, 'error', duration ?? 5500),
    info: (msg, duration) => push(msg, 'info', duration),
    dismiss
  }), [push, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.variant}`} role="status">
            <span className="toast-icon">
              {t.variant === 'success' ? '✓' : t.variant === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="toast-msg">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
