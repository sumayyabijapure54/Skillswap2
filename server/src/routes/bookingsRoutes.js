import { Router } from 'express';
import {
  createBooking,
  checkoutBooking,
  listBookings,
  cancelBooking,
  listMentorBookings,
  mentorCancelBooking,
  completeBooking,
  getMentorEarnings
} from '../controllers/bookingsController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema, checkoutBookingSchema } from '../validation/schemas.js';

const router = Router();

router.post('/', requireAuth, validate(createBookingSchema), createBooking);
router.post('/checkout', requireAuth, validate(checkoutBookingSchema), checkoutBooking);
router.get('/', requireAuth, listBookings);
router.get('/mentor', requireAuth, listMentorBookings);
router.get('/mentor/earnings', requireAuth, getMentorEarnings);
router.patch('/:id/cancel', requireAuth, cancelBooking);
router.patch('/:id/mentor-cancel', requireAuth, mentorCancelBooking);
router.patch('/:id/complete', requireAuth, completeBooking);

export default router;
