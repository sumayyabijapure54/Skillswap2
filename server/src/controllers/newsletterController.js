import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// POST /api/newsletter/subscribe  { email }  (public — footer signup form)
// Idempotent: re-subscribing with an email already on the list is treated
// as success rather than a 409, since from the visitor's side "I already
// signed up" and "I just signed up" should feel identical.
export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    await NewsletterSubscriber.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );
    res.status(201).json({ message: "You're subscribed." });
  } catch (err) {
    next(err);
  }
}
