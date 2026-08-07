import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// Renders a single-page landscape certificate PDF and pipes it directly to
// the given writable stream (the Express response). Still zero external
// runtime dependencies beyond pdfkit + qrcode (the QR is generated locally
// as a PNG buffer, not fetched from a third-party image API) — so this
// renders identically regardless of network access on the server.
//
// Async because the QR code has to be generated (and awaited) before we can
// draw it into the document. Callers must `await` this.
export async function streamCertificatePdf(certificate, skill, res) {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${certificate.skillId}-certificate.pdf"`
  );

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 30;

  const gold = '#0B664F';
  const goldLight = '#34D399';
  const ink = '#1c1c1c';
  const muted = '#6b6b6b';
  const cream = '#fbf8f2';

  // Brand colors, matching the SkillSwap logo everywhere else on the site.
  const brandInk = '#12131A';
  const brandMint = '#34D399';
  const brandForest = '#0B664F';

  // Draws the SkillSwap yin-yang mark at (cx, cy) with the given radius.
  // Reused for both the header logo and the faint background watermark, so
  // the shape only has to be defined once.
  const drawLogo = (centerX, centerY, radius, opacity = 1) => {
    const s = radius / 100;
    doc.save();
    doc.opacity(opacity);
    doc.translate(centerX - 100 * s, centerY - 100 * s).scale(s);
    doc.circle(100, 100, 98).fill(brandInk);
    doc
      .path('M100 2 A98 98 0 0 1 100 198 A49 49 0 0 1 100 100 A49 49 0 0 0 100 2 Z')
      .fill(brandMint);
    doc.restore();
    doc.opacity(1);
  };

  const verifyUrl = `https://skillswap.example/verify/${certificate.certificateNumber}`;

  // ---- Background wash + border ------------------------------------------------
  doc.rect(0, 0, pageWidth, pageHeight).fill(cream);

  // Faint oversized watermark of the brand mark, centered behind the copy —
  // a common touch on premium certificates that reads as intentional rather
  // than empty space, without competing with the text on top of it.
  drawLogo(pageWidth / 2, pageHeight / 2 + 10, pageHeight * 0.62, 0.035);

  const borderGradient = doc
    .linearGradient(margin, margin, pageWidth - margin, pageHeight - margin)
    .stop(0, goldLight)
    .stop(0.5, gold)
    .stop(1, goldLight);

  doc
    .save()
    .lineWidth(3)
    .rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
    .stroke(borderGradient)
    .lineWidth(0.75)
    .strokeColor(gold)
    .rect(margin + 9, margin + 9, pageWidth - (margin + 9) * 2, pageHeight - (margin + 9) * 2)
    .stroke()
    .lineWidth(0.5)
    .strokeColor(brandForest)
    .rect(margin + 13, margin + 13, pageWidth - (margin + 13) * 2, pageHeight - (margin + 13) * 2)
    .stroke()
    .restore();

  // Corner flourishes — small diamonds at each inner corner
  const corners = [
    [margin + 9, margin + 9],
    [pageWidth - margin - 9, margin + 9],
    [margin + 9, pageHeight - margin - 9],
    [pageWidth - margin - 9, pageHeight - margin - 9]
  ];
  corners.forEach(([x, y]) => {
    doc.save().translate(x, y).rotate(45).rect(-4, -4, 8, 8).fill(gold).restore();
  });

  // ---- Logo mark -----------------------------------------------------------
  const logoY = margin + 34;
  const logoCenterX = pageWidth / 2;
  const logoRadius = 15;
  drawLogo(logoCenterX, logoY, logoRadius);

  // Two-tone "SkillSwap" wordmark, hand-centered as a group: pdfkit's
  // `continued: true` text runs don't compose cleanly with `align: center`
  // (the second segment re-centers on top of the first), so instead we
  // measure each word and position them side by side ourselves.
  doc.fontSize(13).font('Helvetica-Bold');
  const wordY = logoY + logoRadius + 10;
  const skillWidth = doc.widthOfString('Skill');
  const swapWidth = doc.widthOfString('Swap');
  const wordStartX = logoCenterX - (skillWidth + swapWidth) / 2;
  doc.fillColor(brandInk).text('Skill', wordStartX, wordY, { lineBreak: false });
  doc.fillColor(brandForest).text('Swap', wordStartX + skillWidth, wordY, { lineBreak: false });

  // ---- Headline --------------------------------------------------------------
  doc
    .fontSize(22)
    .fillColor(ink)
    .font('Helvetica-Bold')
    .text('Certificate of Completion', 0, margin + 78, { align: 'center' });

  doc
    .fontSize(11)
    .fillColor(muted)
    .font('Helvetica')
    .text('This certifies that', 0, margin + 112, { align: 'center' });

  doc
    .fontSize(28)
    .fillColor(ink)
    .font('Helvetica-Bold')
    .text(certificate.holderName, 0, margin + 132, { align: 'center' });

  doc
    .fontSize(11)
    .fillColor(muted)
    .font('Helvetica')
    .text('has successfully completed', 0, margin + 172, { align: 'center' });

  doc
    .fontSize(20)
    .fillColor(gold)
    .font('Helvetica-Bold')
    .text(certificate.skillTitle, 0, margin + 192, { align: 'center' });

  const mentorLine = certificate.mentorRole
    ? `A course led by ${certificate.mentorName}, ${certificate.mentorRole}`
    : `A course led by ${certificate.mentorName}`;
  doc
    .fontSize(10.5)
    .fillColor(muted)
    .font('Helvetica')
    .text(mentorLine, margin + 60, margin + 222, { align: 'center', width: pageWidth - (margin + 60) * 2 });

  // Course level / lessons metadata, small pill-style row
  const metaParts = [];
  if (certificate.skillLevel) metaParts.push(certificate.skillLevel);
  if (certificate.lessonsCount) metaParts.push(`${certificate.lessonsCount} lessons`);
  if (certificate.courseDuration || skill?.duration) metaParts.push(certificate.courseDuration || skill.duration);
  if (metaParts.length) {
    doc
      .fontSize(9)
      .fillColor(gold)
      .font('Helvetica-Bold')
      .text(metaParts.join('   ·   '), 0, margin + 242, { align: 'center', characterSpacing: 0.5 });
  }

  // ---- Gold seal (bottom-left of the copy block) --------------------------------
  const sealCX = margin + 62;
  const sealCY = pageHeight - margin - 118;
  const sealR = 30;
  doc.save();
  doc.circle(sealCX, sealCY, sealR).fill(gold);
  doc.circle(sealCX, sealCY, sealR - 5).lineWidth(1).stroke(cream);
  // Vector checkmark (a ✓ glyph isn't in the standard PDF base-14 fonts, so
  // draw it as a two-segment stroked path instead).
  doc
    .moveTo(sealCX - 10, sealCY + 1)
    .lineTo(sealCX - 3, sealCY + 8)
    .lineTo(sealCX + 11, sealCY - 9)
    .lineWidth(3)
    .lineJoin('round')
    .lineCap('round')
    .strokeColor(cream)
    .stroke();
  // Ribbon tails
  doc
    .polygon([sealCX - 12, sealCY + sealR - 4], [sealCX - 20, sealCY + sealR + 22], [sealCX - 4, sealCY + sealR + 10])
    .fill(gold);
  doc
    .polygon([sealCX + 12, sealCY + sealR - 4], [sealCX + 20, sealCY + sealR + 22], [sealCX + 4, sealCY + sealR + 10])
    .fill(gold);
  doc.restore();

  // ---- QR code (bottom-right of the copy block) ----------------------------------
  const qrSize = 64;
  const qrX = pageWidth - margin - 60 - qrSize / 2;
  const qrY = pageHeight - margin - 148;
  try {
    const qrBuffer = await QRCode.toBuffer(verifyUrl, { margin: 1, width: qrSize * 4, color: { dark: ink, light: '#ffffff' } });
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
  } catch {
    // If QR generation fails for any reason, skip the code rather than
    // failing the whole certificate download — the text verify URL below
    // still lets anyone confirm it manually.
  }
  doc
    .fontSize(7.5)
    .fillColor(muted)
    .font('Helvetica')
    .text('Scan to verify', qrX - 10, qrY + qrSize + 4, { width: qrSize + 20, align: 'center' });

  // ---- Footer strip: issued / cert ID / verified by --------------------------------
  const footerY = pageHeight - margin - 70;
  const colWidth = (pageWidth - margin * 2) / 3;

  const issuedDate = new Date(certificate.issuedAt || certificate.createdAt);
  const footerCol = (i, label, value) => {
    const x = margin + colWidth * i;
    doc
      .fontSize(8.5)
      .fillColor(muted)
      .font('Helvetica')
      .text(label.toUpperCase(), x, footerY, { width: colWidth, align: 'center', characterSpacing: 1 });
    doc
      .fontSize(11.5)
      .fillColor(ink)
      .font('Helvetica-Bold')
      .text(value, x, footerY + 13, { width: colWidth, align: 'center' });
  };

  footerCol(0, 'Issued', issuedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }));
  footerCol(1, 'Certificate ID', certificate.certificateNumber);
  footerCol(2, 'Verified by', 'SkillSwap');

  // ---- Signatures ---------------------------------------------------------------
  const sigY = footerY - 46;
  const sigWidth = 170;
  const sigLeftX = pageWidth / 2 - sigWidth - 30;
  const sigRightX = pageWidth / 2 + 30;

  const drawSignature = (x, name, title) => {
    doc
      .fontSize(15)
      .fillColor(ink)
      .font('Helvetica-Oblique')
      .text(name, x, sigY - 20, { width: sigWidth, align: 'center' });
    doc
      .moveTo(x + 10, sigY)
      .lineTo(x + sigWidth - 10, sigY)
      .lineWidth(0.75)
      .strokeColor(muted)
      .stroke();
    doc
      .fontSize(9)
      .fillColor(muted)
      .font('Helvetica')
      .text(title, x, sigY + 6, { width: sigWidth, align: 'center' });
  };

  drawSignature(sigLeftX, 'A. Sharma', 'Founder, SkillSwap');
  drawSignature(sigRightX, certificate.mentorName, certificate.mentorRole || 'Mentor');

  // ---- Verify URL --------------------------------------------------------------
  doc
    .fontSize(8)
    .fillColor(muted)
    .font('Helvetica')
    .text(`Verify at ${verifyUrl.replace('https://', '')}`, 0, pageHeight - margin - 18, { align: 'center' });

  doc.end();
}
