import { Router } from 'express';
import {
  createBooking,
  listBookings,
  cancelBooking,
  listMentorBookings,
  mentorCancelBooking,
  completeBooking
} from '../controllers/bookingsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, listBookings);
router.get('/mentor', requireAuth, listMentorBookings);
router.patch('/:id/cancel', requireAuth, cancelBooking);
router.patch('/:id/mentor-cancel', requireAuth, mentorCancelBooking);
router.patch('/:id/complete', requireAuth, completeBooking);

export default router;
