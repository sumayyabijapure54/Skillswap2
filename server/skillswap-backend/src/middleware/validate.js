// Validates req.body against a zod schema. On success, req.body is replaced
// with the parsed (and coerced/trimmed) data — e.g. a scheduledAt string
// becomes a real Date, an email gets lowercased — so controllers can trust
// their inputs instead of re-checking them. On failure, responds with a
// field-by-field breakdown instead of a single generic message.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(body)',
        message: issue.message
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    req.body = result.data;
    next();
  };
}
