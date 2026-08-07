export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
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
    return res.status(400).json({ message });
  }

  // Multer upload errors (file too large, wrong type, etc.)
  if (err.name === 'MulterError' || err.message?.includes('Only JPEG, PNG, or WEBP')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
}
