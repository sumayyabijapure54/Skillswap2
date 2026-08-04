import { Router } from 'express';
import {
  createBooking,
  checkoutBooking,
  createBookingOrder,
  verifyBookingPayment,
  listBookings,
  getBooking,
  cancelBooking,
  updateBookingNotes,
  listMentorBookings,
  mentorCancelBooking,
  completeBooking,
  getMentorEarnings,
  getMentorStudents,
  getMentorAnalytics
} from '../controllers/bookingsController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createBookingSchema,
  checkoutBookingSchema,
  createBookingOrderSchema,
  verifyRazorpayPaymentSchema,
  updateBookingNotesSchema
} from '../validation/schemas.js';

const router = Router();

router.post('/', requireAuth, validate(createBookingSchema), createBooking);
router.post('/checkout', requireAuth, validate(checkoutBookingSchema), checkoutBooking);
router.post('/checkout/razorpay/create-order', requireAuth, validate(createBookingOrderSchema), createBookingOrder);
router.post('/checkout/razorpay/verify', requireAuth, validate(verifyRazorpayPaymentSchema), verifyBookingPayment);
router.get('/', requireAuth, listBookings);
router.get('/mentor', requireAuth, listMentorBookings);
router.get('/mentor/earnings', requireAuth, getMentorEarnings);
router.get('/mentor/students', requireAuth, getMentorStudents);
router.get('/mentor/analytics', requireAuth, getMentorAnalytics);
router.get('/:id', requireAuth, getBooking);
router.patch('/:id/cancel', requireAuth, cancelBooking);
router.patch('/:id/notes', requireAuth, validate(updateBookingNotesSchema), updateBookingNotes);
router.patch('/:id/mentor-cancel', requireAuth, mentorCancelBooking);
router.patch('/:id/complete', requireAuth, completeBooking);

export default router;
