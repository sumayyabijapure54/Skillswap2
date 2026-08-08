import mongoose from 'mongoose';

const { Schema } = mongoose;

// One LiveSession = one mentor-hosted group session for a course (Skill).
// "Enrolled students" is not a separate collection — it's every distinct
// user with a non-cancelled Booking on this skillId (see Booking model +
// bookingsController's mentor-side aggregates, which already treat Booking
// as the source of truth for enrollment). We resolve that roster at
// create/notify time rather than duplicating it here.
const AttendanceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // joinedAt = when the student clicked "Join" and passed the
    // enrollment/capacity gate (join INITIATED). confirmedAt = when Jitsi's
    // own videoConferenceJoined event actually fired for them (they are
    // genuinely inside the conference, not just on the prejoin screen).
    // Duration is measured from confirmedAt, never from joinedAt — see
    // leaveLiveSession()/confirmLiveSessionJoin() in liveSessionsController.js.
    joinedAt: { type: Date, default: null },
    confirmedAt: { type: Date, default: null },
    leftAt: { type: Date, default: null },
    // Sum of all confirmedAt->leftAt intervals, in case someone reconnects.
    totalSeconds: { type: Number, default: 0 },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' }
  },
  { _id: false }
);

const LiveSessionSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: String, required: true, index: true }, // matches Skill.id (slug)
    skillTitle: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },

    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 5, max: 480 },
    // Derived at creation/edit time from startTime + durationMinutes so
    // queries (e.g. "is this live-eligible") don't need to recompute it.
    endTime: { type: Date, required: true },
    timezone: { type: String, default: 'UTC', trim: true },

    meetingProvider: { type: String, enum: ['jitsi', 'zoom', 'google-meet', 'custom'], default: 'jitsi' },
    // Only meaningful for zoom/google-meet/custom — jitsi rooms are
    // generated deterministically from the session id (see jitsiRoomName
    // in liveSessionsController.js) so they never need to be stored.
    meetingUrl: { type: String, default: null, trim: true },

    status: { type: String, enum: ['scheduled', 'live', 'ended', 'cancelled'], default: 'scheduled', index: true },
    maxParticipants: { type: Number, default: null },

    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    recordingUrl: { type: String, default: null, trim: true },

    attendance: { type: [AttendanceSchema], default: [] },

    // Set by the reminder scan (realtime/liveSessionScheduler.js) so the
    // "starts in 10 minutes" notification fires exactly once per session.
    reminderSentAt: { type: Date, default: null }
  },
  { timestamps: true }
);

LiveSessionSchema.index({ skillId: 1, status: 1, startTime: 1 });
LiveSessionSchema.index({ mentor: 1, status: 1, startTime: 1 });

LiveSessionSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('LiveSession', LiveSessionSchema);
