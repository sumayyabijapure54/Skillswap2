export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Mongoose duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    console.warn(`[${req.method} ${req.originalUrl}] 409 duplicate ${field}`);
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  // Mongoose schema validation errors. Guarded on `err.errors` too, not
  // just the name — express-rate-limit's internal error class is also
  // named "ValidationError" but has no `.errors` object, so without this
  // guard it hit this branch and threw a second, unhandled TypeError.
  if (err.name === 'ValidationError' && err.errors) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    console.warn(`[${req.method} ${req.originalUrl}] 400 validation: ${message}`);
    return res.status(400).json({ message });
  }

  // Multer upload errors (file too large, wrong type, etc.)
  if (err.name === 'MulterError' || err.message?.includes('Only JPEG, PNG, or WEBP')) {
    console.warn(`[${req.method} ${req.originalUrl}] 400 upload: ${err.message}`);
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;

  // Expected/client errors (4xx) are logged at "warn" and kept short —
  // these happen during normal use (bad input, not found, unauthorized)
  // and don't need a full stack trace cluttering the logs. Unexpected
  // (5xx) errors are logged at "error" with the full stack, since those
  // are the ones worth waking up for. Never logs req.body/headers, so
  // passwords/tokens/payment fields in a request never reach the logs.
  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}] ${status}:`, err);
  } else {
    console.warn(`[${req.method} ${req.originalUrl}] ${status}: ${err.message || 'error'}`);
  }

  res.status(status).json({
    message: err.message || 'Internal server error'
  });
}
