import { Router } from 'express';
import {
  createLiveSession,
  updateLiveSession,
  deleteLiveSession,
  cancelLiveSession,
  startLiveSession,
  endLiveSession,
  attachRecording,
  joinLiveSession,
  confirmLiveSessionJoin,
  leaveLiveSession,
  getLiveSession,
  listLiveSessions,
  myUpcomingLiveSessions,
  myLiveLiveSessions,
  myLiveSessionHistory,
  mentorUpcomingLiveSessions,
  mentorTodayLiveSessions,
  getAttendance
} from '../controllers/liveSessionsController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createLiveSessionSchema,
  updateLiveSessionSchema,
  endLiveSessionSchema,
  attachRecordingSchema
} from '../validation/schemas.js';

const router = Router();

router.use(requireAuth);

// Specific "my/..." and "mentor/..." routes must be declared before the
// generic "/:id" route or Express would try to treat "my"/"mentor" as an id.
router.get('/my/upcoming', myUpcomingLiveSessions);
router.get('/my/live', myLiveLiveSessions);
router.get('/my/history', myLiveSessionHistory);
router.get('/mentor/upcoming', mentorUpcomingLiveSessions);
router.get('/mentor/today', mentorTodayLiveSessions);

router.get('/', listLiveSessions);
router.post('/', validate(createLiveSessionSchema), createLiveSession);

router.get('/:id', getLiveSession);
router.patch('/:id', validate(updateLiveSessionSchema), updateLiveSession);
router.delete('/:id', deleteLiveSession);
router.patch('/:id/cancel', cancelLiveSession);

router.post('/:id/start', startLiveSession);
router.post('/:id/end', validate(endLiveSessionSchema), endLiveSession);
router.patch('/:id/recording', validate(attachRecordingSchema), attachRecording);

router.post('/:id/join', joinLiveSession);
router.post('/:id/confirm-join', confirmLiveSessionJoin);
router.post('/:id/leave', leaveLiveSession);

router.get('/:id/attendance', getAttendance);

export default router;
