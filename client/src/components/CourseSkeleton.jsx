import React from 'react';
import { Skeleton } from './Skeleton.jsx';

export function VideoAreaSkeleton() {
  return (
    <div className="video-frame" style={{ padding: 0 }}>
      <Skeleton height="100%" width="100%" radius="18px" />
    </div>
  );
}

export function PlaylistSkeleton({ rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="side-lesson" style={{ cursor: 'default' }}>
          <Skeleton height="44px" width="78px" radius="8px" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Skeleton height="12px" width="90%" style={{ marginBottom: '8px' }} />
            <Skeleton height="10px" width="50%" />
          </div>
        </div>
      ))}
    </>
  );
}
