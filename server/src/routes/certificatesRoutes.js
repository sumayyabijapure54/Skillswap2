import { Router } from 'express';
import { issueCertificate, listMyCertificates, verifyCertificate, downloadCertificatePdf, setCertificateVisibility } from '../controllers/certificatesController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Must be registered before /:skillId/issue-style dynamic paths so
// "verify" isn't parsed as a skillId — no collision here, but kept
// consistent with the rest of the routers.
router.get('/', requireAuth, listMyCertificates);
router.get('/verify/:certificateNumber', verifyCertificate);
router.post('/:skillId/issue', requireAuth, issueCertificate);
router.get('/:skillId/pdf', requireAuth, downloadCertificatePdf);
router.patch('/:skillId/visibility', requireAuth, setCertificateVisibility);

export default router;
