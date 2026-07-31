// Verifies a file's actual binary signature ("magic bytes") matches its
// declared MIME type. multer's fileFilter only checks the client-supplied
// Content-Type on the multipart part, which costs an attacker nothing to
// spoof — this closes that gap by inspecting the bytes actually written to
// disk before the upload is accepted.
const SIGNATURES = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]]
};

export function matchesImageSignature(buffer, mimetype) {
  if (mimetype === 'image/webp') {
    // RIFF....WEBP — bytes 4-7 are the chunk size, which varies.
    return (
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }
  const sigs = SIGNATURES[mimetype];
  if (!sigs) return false;
  return sigs.some((sig) => sig.every((byte, i) => buffer[i] === byte));
}
