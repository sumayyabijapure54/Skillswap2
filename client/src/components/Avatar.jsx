import React from 'react';
import { avatarUrl } from '../lib/api.js';

// Renders a profile picture when one is set, falling back to initials
// if there's no avatar OR the image fails to load (deleted file, stale
// path, wrong API base in this environment, etc). Without this fallback,
// a broken <img> just leaves the avatar's background color showing —
// no photo, no initials.
export default function Avatar({ src, name, className, style, as: Tag = 'div', ...rest }) {
  const [broken, setBroken] = React.useState(false);

  // If the avatar path changes (new upload, removed photo), give the
  // new image a fresh chance to load instead of staying stuck on
  // whatever failed before.
  React.useEffect(() => { setBroken(false); }, [src]);

  const initials = (name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const url = avatarUrl(src);
  const showImage = !!url && !broken;

  return (
    <Tag className={className} style={showImage ? { ...style, overflow: 'hidden', padding: 0 } : style} {...rest}>
      {showImage
        ? (
          <img
            src={url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setBroken(true)}
          />
        )
        : initials}
    </Tag>
  );
}
