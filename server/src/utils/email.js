// Sends transactional email via the Resend HTTPS API (https://resend.com).
// We use Resend instead of raw SMTP because outbound SMTP connections from
// hosts like Render frequently time out or get blocked when talking to
// Gmail — Resend sends over regular HTTPS (port 443), which avoids that
// entirely and is purpose-built for transactional email like OTPs and
// password resets.

const RESEND_API_URL = 'https://api.resend.com/emails';

// Sends an email if RESEND_API_KEY is configured in .env. Otherwise, logs
// the content to the console so signup/verification/reset flows still work
// end-to-end in local dev without any email provider set up.
export async function sendMail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('\n📧 [DEV EMAIL — no RESEND_API_KEY configured, logging instead of sending]');
    console.log(`To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, ' ').trim()}\n`);
    return { devMode: true };
  }

  const from = process.env.EMAIL_FROM || 'SkillSwap <onboarding@resend.dev>';

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Resend API error (${res.status}): ${errBody}`);
  }

  return res.json();
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