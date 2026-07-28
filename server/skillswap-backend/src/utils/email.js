import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
  });
  return transporter;
}

// Sends an email if SMTP_HOST is configured in .env. Otherwise, logs the
// content to the console so signup/verification/reset flows still work
// end-to-end in local dev without any email provider set up.
export async function sendMail({ to, subject, html }) {
  const t = getTransporter();

  if (!t) {
    console.log('\n📧 [DEV EMAIL — no SMTP configured, logging instead of sending]');
    console.log(`To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, ' ').trim()}\n`);
    return { devMode: true };
  }

  return t.sendMail({
    from: process.env.EMAIL_FROM || 'SkillSwap <no-reply@skillswap.dev>',
    to,
    subject,
    html
  });
}

export function otpEmailHtml(name, otp) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Verify your email</h2>
      <p>Hi ${name}, use this code to verify your SkillSwap account:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
      <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>`;
}

export function resetPasswordEmailHtml(name, resetUrl) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Reset your password</h2>
      <p>Hi ${name}, click the link below to set a new SkillSwap password. It expires in 30 minutes.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can ignore this email — your password won't change.</p>
    </div>`;
}
