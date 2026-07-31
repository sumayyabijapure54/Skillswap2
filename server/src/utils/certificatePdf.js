import PDFDocument from 'pdfkit';

// Renders a single-page landscape certificate PDF and pipes it directly to
// the given writable stream (the Express response). Deliberately plain
// vector shapes/text — no external fonts or images — so this has zero
// runtime dependencies beyond pdfkit itself and renders identically
// regardless of what's installed on the server.
export function streamCertificatePdf(certificate, skill, res) {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${certificate.skillId}-certificate.pdf"`
  );

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 36;

  const gold = '#c9a34c';
  const ink = '#1c1c1c';
  const muted = '#6b6b6b';

  // Outer border
  doc
    .save()
    .lineWidth(2)
    .strokeColor(gold)
    .rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
    .stroke()
    .lineWidth(0.75)
    .strokeColor(gold)
    .rect(margin + 10, margin + 10, pageWidth - (margin + 10) * 2, pageHeight - (margin + 10) * 2)
    .stroke()
    .restore();

  doc
    .fontSize(11)
    .fillColor(gold)
    .font('Helvetica-Bold')
    .text('SKILLSWAP', 0, margin + 40, { align: 'center', characterSpacing: 4 });

  doc
    .fontSize(20)
    .fillColor(ink)
    .font('Helvetica-Bold')
    .text('Certificate of Completion', 0, margin + 62, { align: 'center' });

  doc
    .fontSize(12)
    .fillColor(muted)
    .font('Helvetica')
    .text('This certifies that', 0, margin + 110, { align: 'center' });

  doc
    .fontSize(30)
    .fillColor(ink)
    .font('Helvetica-Bold')
    .text(certificate.holderName, 0, margin + 132, { align: 'center' });

  doc
    .fontSize(12)
    .fillColor(muted)
    .font('Helvetica')
    .text('has successfully completed', 0, margin + 178, { align: 'center' });

  doc
    .fontSize(22)
    .fillColor(gold)
    .font('Helvetica-Bold')
    .text(certificate.skillTitle, 0, margin + 200, { align: 'center' });

  doc
    .fontSize(11)
    .fillColor(muted)
    .font('Helvetica')
    .text(
      `an ${skill?.duration || 'online'} course led by ${certificate.mentorName}`,
      0,
      margin + 234,
      { align: 'center' }
    );

  const issuedDate = new Date(certificate.issuedAt || certificate.createdAt);
  const footerY = pageHeight - margin - 70;
  const colWidth = (pageWidth - margin * 2) / 3;

  const footerCol = (i, label, value) => {
    const x = margin + colWidth * i;
    doc
      .fontSize(9)
      .fillColor(muted)
      .font('Helvetica')
      .text(label.toUpperCase(), x, footerY, { width: colWidth, align: 'center', characterSpacing: 1 });
    doc
      .fontSize(12)
      .fillColor(ink)
      .font('Helvetica-Bold')
      .text(value, x, footerY + 14, { width: colWidth, align: 'center' });
  };

  footerCol(0, 'Issued', issuedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }));
  footerCol(1, 'Certificate ID', certificate.certificateNumber);
  footerCol(2, 'Verified by', 'SkillSwap');

  doc
    .fontSize(8)
    .fillColor(muted)
    .font('Helvetica')
    .text(
      `Verify this certificate at skillswap.example/verify/${certificate.certificateNumber}`,
      0,
      pageHeight - margin - 22,
      { align: 'center' }
    );

  doc.end();
}
