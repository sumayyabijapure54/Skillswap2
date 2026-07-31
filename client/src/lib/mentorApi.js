import { api } from './api.js';

// Thin wrapper around the server's /api/chatbot/* routes (see
// server/src/controllers/chatbotController.js). Kept separate from the
// generic api.js helpers so the AI Mentor context/components never touch
// raw paths directly.

export function getChatHistory() {
  return api.get('/api/chatbot/history');
}

export function clearChatHistory() {
  return api.del('/api/chatbot/history');
}

export function sendChatMessage(message, context) {
  return api.post('/api/chatbot/message', { message, context: context || null });
}

export function runChatQuickAction(type, context) {
  return api.post('/api/chatbot/quick-action', { type, context: context || null });
}
