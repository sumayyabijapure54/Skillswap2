import Report from '../models/Report.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';

// POST /api/reports  { type, targetId?, reportedUserName, reason }  (protected)
// Any signed-in user can file one — this is the write side that feeds the
// admin moderation queue.
export async function createReport(req, res, next) {
  try {
    const { type, targetId, reportedUserName, reason } = req.body;

    const report = await Report.create({
      reporter: req.user._id,
      type,
      targetId: targetId || null,
      reportedUserName,
      reason
    });

    res.status(201).json({ report });
  } catch (err) {
    next(err);
  }
}

// GET /api/reports?status=&page=&limit=  (admin)
export async function listReports(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 50 });

    const [reports, total] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Report.countDocuments(filter)
    ]);

    res.json({ reports, ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/reports/:id/resolve  (admin)
export async function resolveReport(req, res, next) {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ report });
  } catch (err) {
    next(err);
  }
}
