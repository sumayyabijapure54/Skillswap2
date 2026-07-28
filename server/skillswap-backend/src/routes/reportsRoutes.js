import { Router } from 'express';
import { createReport, listReports, resolveReport } from '../controllers/reportsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReportSchema } from '../validation/schemas.js';

const router = Router();

router.post('/', requireAuth, validate(createReportSchema), createReport);
router.get('/', requireAuth, requireAdmin, listReports);
router.patch('/:id/resolve', requireAuth, requireAdmin, resolveReport);

export default router;
