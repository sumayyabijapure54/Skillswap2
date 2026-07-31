import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from './UserContext.jsx';
import { getChatHistory, clearChatHistory, sendChatMessage, runChatQuickAction } from '../lib/mentorApi.js';

const AiMentorContext = createContext(null);

let seq = 0;
const localId = () => `local-${Date.now()}-${seq++}`;

const QUICK_ACTION_LABELS = {
  quiz: 'Quiz me on this',
  flashcards: 'Make flashcards for this',
  summary: 'Summarize this for me',
  'study-plan': 'Build me a study plan',
  hint: "I'm stuck — give me a hint"
};

export function AiMentorProvider({ children }) {
  const { authed } = useUser();

  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // What screen the learner is currently on — pages (LessonPlayer,
  // SkillDetail, ...) call setPageContext so every question they ask
  // rides along with "what am I looking at right now" without the
  // widget needing to know how to read every page's internals.
  const [pageContext, setPageContextState] = useState(null);
  const setPageContext = useCallback((ctx) => setPageContextState(ctx || null), []);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!authed) {
      setMessages([]);
      hasLoadedRef.current = false;
      return;
    }
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    setLoadingHistory(true);
    getChatHistory()
      .then((data) => setMessages(data?.messages || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [authed]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const pushMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { ...msg, _localId: localId() }]);
  }, []);

  const send = useCallback(async (text, contextOverride) => {
    const trimmed = (text || '').trim();
    if (!trimmed || sending) return;
    setError(null);
    const context = contextOverride !== undefined ? contextOverride : pageContext;

    pushMessage({ role: 'user', content: trimmed, kind: 'chat', context, createdAt: new Date().toISOString() });
    setSending(true);
    try {
      const res = await sendChatMessage(trimmed, context);
      pushMessage({ role: 'assistant', content: res.reply, kind: 'chat', context: null, createdAt: new Date().toISOString() });
      setUnread((n) => (open ? 0 : n + 1));
    } catch (err) {
      const msg = err.message || 'The AI Mentor is having trouble right now — please try again in a moment.';
      setError(msg);
      pushMessage({ role: 'assistant', content: msg, kind: 'chat', context: null, createdAt: new Date().toISOString(), isError: true });
    } finally {
      setSending(false);
    }
  }, [sending, pageContext, pushMessage, open]);

  const quickAction = useCallback(async (type, contextOverride) => {
    if (sending) return;
    setError(null);
    const context = contextOverride !== undefined ? contextOverride : pageContext;
    const label = QUICK_ACTION_LABELS[type] || `Run ${type}`;

    pushMessage({ role: 'user', content: label, kind: type, context, createdAt: new Date().toISOString() });
    setSending(true);
    try {
      const res = await runChatQuickAction(type, context);
      pushMessage({ role: 'assistant', content: res.raw, kind: res.kind, data: res.data, context: null, createdAt: new Date().toISOString() });
      setUnread((n) => (open ? 0 : n + 1));
    } catch (err) {
      const msg = err.message || 'The AI Mentor is having trouble right now — please try again in a moment.';
      setError(msg);
      pushMessage({ role: 'assistant', content: msg, kind: 'chat', context: null, createdAt: new Date().toISOString(), isError: true });
    } finally {
      setSending(false);
    }
  }, [sending, pageContext, pushMessage, open]);

  const clear = useCallback(async () => {
    setMessages([]);
    setError(null);
    try { await clearChatHistory(); } catch { /* best effort */ }
  }, []);

  const value = {
    messages, loadingHistory, sending, error, open, unread,
    setOpen, send, quickAction, clear, pageContext, setPageContext
  };

  return <AiMentorContext.Provider value={value}>{children}</AiMentorContext.Provider>;
}

export function useAiMentor() {
  const ctx = useContext(AiMentorContext);
  if (!ctx) throw new Error('useAiMentor must be used inside <AiMentorProvider>');
  return ctx;
}
