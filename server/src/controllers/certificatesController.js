import Certificate from '../models/Certificate.js';
import Progress from '../models/Progress.js';
import Skill from '../models/Skill.js';
import { generateCertificateNumber } from '../utils/tokens.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import { notifyUser } from '../utils/notify.js';
import { streamCertificatePdf } from '../utils/certificatePdf.js';

// Mirrors Certificate's toJSON transform for .lean() results.
function leanCertificate(c) {
  const { _id, __v, user, createdAt, ...rest } = c;
  return { id: _id, issuedAt: createdAt, createdAt, ...rest };
}

// Shared by the manual "issue" endpoint and the auto-issue hook in
// progressController.completeLesson. Returns { certificate, justIssued }
// or { certificate: null } if the skill isn't actually complete yet.
// Idempotent — calling it again after issuance just returns the existing one.
export async function issueIfEarned(user, skillId) {
  const existing = await Certificate.findOne({ user: user._id, skillId });
  if (existing) return { certificate: existing, justIssued: false };

  const [progress, skill] = await Promise.all([
    Progress.findOne({ user: user._id, skillId }),
    Skill.findOne({ id: skillId })
  ]);

  if (!skill || !skill.lessons.length || !progress) return { certificate: null, justIssued: false };
  if (progress.completedLessons.length < skill.lessons.length) return { certificate: null, justIssued: false };

  try {
    const certificate = await Certificate.create({
      user: user._id,
      skillId,
      skillTitle: skill.title,
      mentorName: skill.mentor.name,
      holderName: user.name,
      certificateNumber: generateCertificateNumber()
    });

    await notifyUser({
      user: user._id,
      type: 'system',
      text: `You earned a certificate for completing "${skill.title}"!`
    });

    return { certificate, justIssued: true };
  } catch (err) {
    // Lost a race with a concurrent request (unique index on user+skillId) —
    // just return whichever one won.
    if (err.code === 11000) {
      const winner = await Certificate.findOne({ user: user._id, skillId });
      return { certificate: winner, justIssued: false };
    }
    throw err;
  }
}

// POST /api/certificates/:skillId/issue  (protected)
// Manual trigger, in case a client wants to claim a certificate explicitly
// rather than rely on the auto-issue hook in the lesson-complete endpoint.
export async function issueCertificate(req, res, next) {
  try {
    const { skillId } = req.params;
    const { certificate, justIssued } = await issueIfEarned(req.user, skillId);

    if (!certificate) {
      return res.status(400).json({ message: "You haven't completed all lessons in this skill yet" });
    }

    res.status(justIssued ? 201 : 200).json({ certificate });
  } catch (err) {
    next(err);
  }
}

// GET /api/certificates/:skillId/pdf  (protected — the certificate holder only)
// Streams a server-rendered PDF of the certificate, so download doesn't
// depend on the browser's print-to-PDF dialog. Does NOT issue a new
// certificate — the learner must already have earned one (via the
// lesson-complete auto-issue hook or the manual /issue endpoint above).
export async function downloadCertificatePdf(req, res, next) {
  try {
    const { skillId } = req.params;
    const certificate = await Certificate.findOne({ user: req.user._id, skillId });
    if (!certificate) {
      return res.status(404).json({ message: "You haven't earned a certificate for this skill yet" });
    }

    const skill = await Skill.findOne({ id: skillId }).lean();
    streamCertificatePdf(certificate, skill, res);
  } catch (err) {
    next(err);
  }
}

// GET /api/certificates?page=&limit=  (protected) — everything the current user has earned
export async function listMyCertificates(req, res, next) {
  try {
    const filter = { user: req.user._id };
    const { limit, page, skip } = parsePagination(req.query, { defaultLimit: 50 });

    const [certificates, total] = await Promise.all([
      Certificate.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Certificate.countDocuments(filter)
    ]);

    res.json({ certificates: certificates.map(leanCertificate), ...paginationMeta({ page, limit, total }) });
  } catch (err) {
    next(err);
  }
}

// GET /api/certificates/verify/:certificateNumber  (public)
// Lets anyone check a certificate is real without exposing the holder's account.
export async function verifyCertificate(req, res, next) {
  try {
    const certificate = await Certificate.findOne({ certificateNumber: req.params.certificateNumber });
    if (!certificate) {
      return res.status(404).json({ valid: false, message: 'No certificate found with that number' });
    }
    res.json({
      valid: true,
      holderName: certificate.holderName,
      skillTitle: certificate.skillTitle,
      mentorName: certificate.mentorName,
      certificateNumber: certificate.certificateNumber,
      issuedAt: certificate.createdAt
    });
  } catch (err) {
    next(err);
  }
}
