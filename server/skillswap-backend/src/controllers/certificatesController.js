import Certificate from '../models/Certificate.js';
import Progress from '../models/Progress.js';
import Skill from '../models/Skill.js';
import Notification from '../models/Notification.js';
import { generateCertificateNumber } from '../utils/tokens.js';

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

    await Notification.create({
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

// GET /api/certificates  (protected) — everything the current user has earned
export async function listMyCertificates(req, res, next) {
  try {
    const certificates = await Certificate.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ certificates });
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
