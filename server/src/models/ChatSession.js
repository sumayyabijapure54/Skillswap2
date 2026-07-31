import mongoose from 'mongoose';

const { Schema } = mongoose;

// One ongoing AI Mentor conversation per user (not per page/lesson) — the
// same continuity a human mentor would have, so "remember what I asked
// yesterday" actually works. Context about *which* lesson/skill a message
// was sent from rides along on the message itself so the transcript still
// reads sensibly, but doesn't fork the conversation.
const ChatMessageSchema = new Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    // What quick-action produced this turn, if any — lets the frontend
    // decide whether to render a message as a quiz/flashcard set/plain
    // text without having to re-parse it.
    kind: { type: String, enum: ['chat', 'quiz', 'flashcards', 'summary', 'study-plan', 'hint'], default: 'chat' },
    // Loose context snapshot (skillId/skillTitle/lessonTitle) so the
    // transcript UI can show "asked while watching: React Hooks §3".
    context: { type: Schema.Types.Mixed, default: null }
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const ChatSessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] }
  },
  { timestamps: true }
);

ChatSessionSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  }
});

export default mongoose.model('ChatSession', ChatSessionSchema);
