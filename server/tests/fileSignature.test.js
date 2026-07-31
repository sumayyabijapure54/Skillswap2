import { describe, it, expect } from 'vitest';
import { matchesImageSignature } from '../src/utils/fileSignature.js';

const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const JPEG_HEADER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const WEBP_HEADER = Buffer.concat([Buffer.from('RIFF'), Buffer.from([0, 0, 0, 0]), Buffer.from('WEBP')]);
const FAKE_HTML = Buffer.from('<html><script>alert(1)</script></html>');

describe('matchesImageSignature', () => {
  it('accepts a real PNG header claiming image/png', () => {
    expect(matchesImageSignature(PNG_HEADER, 'image/png')).toBe(true);
  });

  it('accepts a real JPEG header claiming image/jpeg', () => {
    expect(matchesImageSignature(JPEG_HEADER, 'image/jpeg')).toBe(true);
  });

  it('accepts a real WEBP header claiming image/webp', () => {
    expect(matchesImageSignature(WEBP_HEADER, 'image/webp')).toBe(true);
  });

  it('rejects HTML/script content spoofed as image/png', () => {
    expect(matchesImageSignature(FAKE_HTML, 'image/png')).toBe(false);
  });

  it('rejects a PNG file mislabeled as image/jpeg', () => {
    expect(matchesImageSignature(PNG_HEADER, 'image/jpeg')).toBe(false);
  });

  it('rejects a JPEG file mislabeled as image/webp', () => {
    expect(matchesImageSignature(JPEG_HEADER, 'image/webp')).toBe(false);
  });

  it('rejects an unrecognized mimetype outright', () => {
    expect(matchesImageSignature(PNG_HEADER, 'application/pdf')).toBe(false);
  });

  it('rejects a too-short buffer', () => {
    expect(matchesImageSignature(Buffer.from([0x89, 0x50]), 'image/png')).toBe(false);
  });
});
